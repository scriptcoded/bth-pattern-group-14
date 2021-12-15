/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')
const { Role } = require('@prisma/client')

const paymentService = require('../services/payment.service')
const { useAsync } = require('../utils/express')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')

module.exports.topup = [
  checkSchema({
    amount: {
      isInt: true,
      errorMessage: 'amount must be an integer'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    const session = await paymentService.createCheckoutSession(req.db, req.user.id, 'Manual topup', req.body.amount)

    res.json({
      data: {
        checkoutURL: session.url
      }
    })
  })
]

module.exports.stripeWebhook = [
  useAsync(async (req, res) => {
    const payload = req.rawBody
    const sig = req.headers['stripe-signature']

    paymentService.verifyWebhook(payload, sig)

    if (req.body.type === 'checkout.session.completed') {
      await paymentService.getCheckoutStatus(req.db, req.body.data.object.id)
    } else if (req.body.type === 'invoice.payment_succeeded') {
      await paymentService.getInvoiceStatus(req.db, req.body.data.object.id)
    }

    res.json({})
  })
]
