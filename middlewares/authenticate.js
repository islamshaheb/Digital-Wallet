/** @format */

const jwt = require('jsonwebtoken');
const variables = require('../variables/index');
module.exports = async function (ctx, next) {
  const token = ctx.request.headers.token;

  await jwt.verify(token, variables.secret, async function (err, decoded) {
    if (!err) {
      const userId = decoded.userObject.userId;
      if (userId) {
        ctx.request.headers['userid'] = userId;
        await next();
      } else {
        ctx.status = 401;
        ctx.body = {
          message: 'Unauthorised',
        };
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        message: 'Unauthorised',
      };
    }
  });

  return ctx;
};
