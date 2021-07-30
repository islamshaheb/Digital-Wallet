/** @format */

const env = process.env.APP_ENV || 'local';
const appPort = process.env.APP_PORT;
const host = process.env.APP_HOST;
const secret = process.env.APP_SECRETKEY;
const sendgridAdapterUrl = process.env.SENDGRID_ADAPTER_URL;
const maximumImageSize = process.env.MAX_SIZE;
const currencyConverter = process.env.CURRENCY_CONVERTER_URL;
const maximumAllowedTransfer = 3;
const maximumAllowedTransferAmount = 100;

const allowedCurrencies = ['BDT', 'USD'];

const variables = {
  appPort,
  env,
  host,
  secret,
  sendgridAdapterUrl,
  allowedCurrencies,
  maximumImageSize,
  maximumAllowedTransfer,
  maximumAllowedTransferAmount,
  currencyConverter,
};

module.exports = variables;
