const schedule = require('node-schedule')

const { sendInvoices } = require('./services/payment.service')
const { prisma } = require('./utils/prisma')

module.exports.startSchedules = function startSchedules () {
  // At 10:00 on the 28'th of each month
  schedule.scheduleJob('0 10 28 * *', () => {
    sendInvoices(prisma)
      .then(() => console.log('Sent invoices'))
      .catch(e => console.error('Failed sending invoices in scheduled job:', e))
  })
}
