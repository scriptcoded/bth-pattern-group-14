// import { paymentService } from '../services/payment.service'

const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')
const paymentService = require('../services/payment.service')

// const paymentService = jest.createMockFromModule('../services/payment.service')
const paymentController = require('./payment.controller')

// jest.mock('../services/payment.service', () => ({
//   createCheckoutSession: jest.fn()
// }))

// jest.mock('../services/payment.service')

// const paymentServiceGet = paymentService.createCheckoutSession

// const mockPay = [
//   {
//     id: 'a',
//     amount: 1,
//     checkoutURL: 'b'
//   }
// ]

let req
let res
let next
// let paymentService
beforeEach(() => {
  req = {
    db: prismaMock,
    params: {}
  }

  // paymentService = jest.fn()

  // paymentServiceGet.mockReset()

  // jest.mock('./payment.controller')

  // paymentService = {
  //   createCheckoutSession: jest.fn()
  // }

  // paymentService = jest.fn()

  res = {
    json: jest.fn()
  }

  next = createWaitableMock()
})

test('topUp returns correct amount topped up', async () => {
  const session = {
    url: 'b'
  }
  // req.db, req.user.id, 'Manual topup', req.body.amount

  req.body = { amount: 1000 }
  req.user = {
    id: 'a'
  }

  jest.spyOn(paymentService, 'createCheckoutSession').mockResolvedValue(session)
  // paymentService.createCheckoutSession.mockResolvedValue(session)
  // paymentService.createCheckoutSession.mockImplementationOnce(() => {
  //   return session
  // })

  getControllerMethod(paymentController.topup)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      checkoutURL: session.url
    }
  }))
})

test('invoice returns nothing', async () => {
  req.user = {
    id: 'a'
  }
  jest.spyOn(paymentService, 'createInvoiceFromBalance').mockResolvedValue({})

  getControllerMethod(paymentController.invoice)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: {} })
})

test('stripeWebhook get all paths', async () => {
  req = {
    user: {
      id: 'a'
    },
    rawBody: 'a',
    headers: {
      'stripe-signature': 'a'
    },
    body: {
      data: {
        object: {
          id: 'a'
        }
      }
    }
  }
  // req.body.data.object.id
  jest.spyOn(paymentService, 'verifyWebhook').mockResolvedValue({})
  jest.spyOn(paymentService, 'getCheckoutStatus').mockResolvedValue({})
  jest.spyOn(paymentService, 'getInvoiceStatus').mockResolvedValue({})

  // With nothing
  getControllerMethod(paymentController.stripeWebhook)(req, res, next)
  await next.waitToHaveBeenCalled()
  expect(res.json).toHaveBeenCalledWith({})

  req.body.type = 'checkout.session.completed'

  getControllerMethod(paymentController.stripeWebhook)(req, res, next)
  await next.waitToHaveBeenCalled()
  expect(res.json).toHaveBeenCalledWith({})

  req.body.type = 'invoice.payment_succeeded'

  getControllerMethod(paymentController.stripeWebhook)(req, res, next)
  await next.waitToHaveBeenCalled()
  expect(res.json).toHaveBeenCalledWith({})
})

test('checkInvoice returns paid invoice', async () => {
  const mockAnswer = {
    paid: true
  }
  req.user = {
    id: 'a'
  }
  jest.spyOn(paymentService, 'getInvoiceStatus').mockResolvedValue(mockAnswer)

  getControllerMethod(paymentController.checkInvoice)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockAnswer })
})

test('checkInvoice returns unpaid invoice with link', async () => {
  const mockAnswer = {
    paid: false,
    link: 'link'
  }
  const mockReturnValue = {
    paid: false,
    invoiceLink: 'link'
  }
  req.user = {
    id: 'a'
  }
  jest.spyOn(paymentService, 'getInvoiceStatus').mockResolvedValue(mockReturnValue)

  getControllerMethod(paymentController.checkInvoice)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockAnswer })
})

// test('updateDrivingZone respects url param', async () => {
//   req.params.amount = 10

//   getControllerMethod(paymentController.topup)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   expect(req.db.paymentService.createCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({
//     where: {
//       id: req.params.amount
//     }
//   }))
// })
