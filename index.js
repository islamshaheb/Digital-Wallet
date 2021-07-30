require('dotenv').config();

const Koa = require('koa');
const cors = require('koa2-cors');
const variables = require('./variables');
const router = require('./routes');
const koaBody = require('koa-body');

const app = new Koa();

app.use(koaBody());
app.use(cors({ origin: '*' }));
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
app.listen(variables.appPort, () => {
    console.log(`API server listening on ${variables.host}:${variables.appPort}`);
});

// Expose app
module.exports = app;
