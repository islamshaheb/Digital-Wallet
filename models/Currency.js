/** @format */

//dependencise
const axios = require('axios');

//internal dependencise
const { currencyConverter } = require('../variables/index');

exports.convertCurrency = (from, to, amount) => {
  return axios
    .get(`${currencyConverter}/convert/${from}/${to}/${amount}`)
    .then((response) => response.data);
};
