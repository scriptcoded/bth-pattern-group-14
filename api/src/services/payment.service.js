const createError = require('http-errors')
const { Stripe } = require('stripe')

const { config } = require('../config')
const constants = require('../constants')

/**
 * Send a new invoice with a total ride cost to a user via email.
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} userId
 * @param {number} total Ride total in Swedish öre
 */
async function createInvoice (db, userId, total) {
  const customerId = await ensureCustomer(db, userId)

  const stripe = new Stripe(config.stripe.secretKey)

  const product = await stripe.products.create({
    name: 'Bike rides for the month'
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: total,
    currency: 'sek'
  })

  await stripe.invoiceItems.create({
    customer: customerId,
    price: price.id
  })

  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
    collection_method: 'send_invoice',
    days_until_due: 30
  })

  const sentInvoice = await stripe.invoices.sendInvoice(invoice.id)

  await db.payment.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      amount: total,
      automatic: true,
      paid: false,
      invoiceId: invoice.id,
      invoiceLink: sentInvoice.hosted_invoice_url
    }
  })
}

/**
 * Send a new invoice to a user based on their balance.
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} userId
 */
async function createInvoiceFromBalance (db, userId) {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Only charge if they owe us money
  if (user.balance < 0) {
    await createInvoice(db, userId, -user.balance)
  }
}

/**
 * Ensure that a user is registered as a customer in Stripe. If not, create a
 * new customer.
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {*} user
 */
async function ensureCustomer (db, userId) {
  // Find the user explicitly so that we don't accidentally use a cached user or
  // something like that.
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId
  }

  const stripe = new Stripe(config.stripe.secretKey)

  const customer = await stripe.customers.create({
    name: user.name,
    email: user.email
  })

  await db.user.update({
    where: {
      id: userId
    },
    data: {
      stripeCustomerId: customer.id
    }
  })

  return customer.id
}

/**
 *
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} userId ID of the user to bill
 * @param {string} paymentName Name of product to show on checkout page
 * @param {number} total Total amount to bill the user in Swedish öre
 */
async function createCheckoutSession (db, userId, paymentName, total) {
  const stripe = new Stripe(config.stripe.secretKey)

  const product = await stripe.products.create({
    name: paymentName
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: total,
    currency: 'sek'
  })

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${config.frontendURL}/profile?topup_result=success`,
    cancel_url: `${config.frontendURL}/profile?topup_result=cancelled`
  })

  await db.payment.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      amount: total,
      automatic: false,
      paid: false,
      checkoutId: session.id
    }
  })

  return session
}

/**
 *
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} invoiceId Stripe invoice ID
 */
async function getInvoiceStatus (db, invoiceId) {
  let payment = await db.payment.findUnique({
    where: {
      invoiceId
    }
  })

  if (!payment) {
    throw new Error('Payment not found')
  }

  const stripe = new Stripe(config.stripe.secretKey)

  const invoice = await stripe.invoices.retrieve(invoiceId)

  if (invoice.paid) {
    payment = await db.payment.update({
      where: {
        id: payment.id
      },
      data: {
        paid: true
      }
    })

    await topUpUser(db, payment.userId, invoice.amount_paid)
  }

  return payment
}

/**
 *
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} invoiceId Stripe invoice ID
 */
async function getCheckoutStatus (db, checkoutId) {
  const payment = await db.payment.findUnique({
    where: {
      checkoutId
    }
  })

  if (!payment) {
    throw new Error('Payment not found')
  }

  const stripe = new Stripe(config.stripe.secretKey)

  const session = await stripe.checkout.sessions.retrieve(checkoutId)

  if (session.payment_status === 'paid') {
    await db.payment.update({
      where: {
        id: payment.id
      },
      data: {
        paid: true
      }
    })

    await topUpUser(db, payment.userId, session.amount_total)
  }
}

function verifyWebhook (payload, sig) {
  const stripe = new Stripe(config.stripe.secretKey)

  try {
    stripe.webhooks.constructEvent(payload, sig, config.stripe.webhookSecret)
  } catch (err) {
    throw createError(400, `Webhook Error: ${err.message}`)
  }
}

/**
 *
 * @param {number} rideMinutes Number of minutes to charge for
 * @param {boolean} correctedParking If the bike parking was corrected
 * @param {boolean} invalidParking If the bike was parked outside a parking zone
 */
function calculateRideCost (rideMinutes, correctedParking, invalidParking) {
  const baseCharge = constants.MINUTE_PRICE * rideMinutes
  const parkingDiscount = constants.FIX_INVALID_PARK_DISCOUNT * correctedParking
  const parkingFee = constants.INVALID_PARK_FEE * invalidParking

  const total = baseCharge - parkingDiscount + parkingFee

  return total
}

/**
 *
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} userId ID of user to charge
 * @param {number} amount Amount to charge user in Swedish öre
 */
async function chargeUser (db, userId, amount) {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  await db.user.update({
    where: {
      id: userId
    },
    data: {
      balance: {
        decrement: amount
      }
    }
  })
}

/**
 *
 * @param {import("@prisma/client").PrismaClient} db Prisma instance
 * @param {string} userId ID of user to top up
 * @param {number} amount Amount to top up user in Swedish öre
 */
async function topUpUser (db, userId, amount) {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  await db.user.update({
    where: {
      id: userId
    },
    data: {
      balance: {
        increment: amount
      }
    }
  })
}

module.exports = {
  createInvoice,
  createInvoiceFromBalance,
  ensureCustomer,
  createCheckoutSession,
  getInvoiceStatus,
  getCheckoutStatus,
  verifyWebhook,
  calculateRideCost,
  chargeUser,
  topUpUser
}
