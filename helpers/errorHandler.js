const stringifySafe = require("../helpers/stringifySafe");

const errorResponseHandler = (ctx, err) => {
  const { status, title = null, errors = null, request = {}, data = {} } = err;
  const instance =
    request && request.path !== undefined ? request.path : ctx.request.url;
  let errorTitle;
  switch (status) {
    case 400:
      ctx.status = 400;
      ctx.body = errors || data.errors;
      break;
    case 401:
      ctx.status = 401;
      ctx.body = {
        title: title || "Authentication Failed",
        instance
      };
      break;
    case 404:
      ctx.status = 404;
      ctx.body = {
        title,
        instance
      };
      break;
    case 409:
      ctx.status = 409;
      ctx.response.conflict(null, title);
      break;
    case 503:
      errorTitle =
        title ||
        (err.source !== undefined
          ? `${err.source} unavailable`
          : "Service unavailable");
      // ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.serviceUnavailable(null, {
        title: errorTitle,
        instance
      });
      break;
    default:
      errorTitle =
        title ||
        (err.source !== undefined
          ? `${err.source} Internal Error`
          : "Internal Error");
      // ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.internalServerError(status, {
        title: errorTitle,
        instance
      });
  }
};
module.exports = errorResponseHandler;
