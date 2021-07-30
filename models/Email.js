/** @format */

//dependencise
const axios = require('axios');

//internal dependencise
const { sendgridAdapterUrl } = require('../variables/index');

exports.send = (request) => {
  return axios.post(`${sendgridAdapterUrl}/email`, request).then((response) => response.data);
};
