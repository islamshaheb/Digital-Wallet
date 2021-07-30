/** @format */
const multer = require('@koa/multer');
const upload = multer();
const koaCompose = require('koa-compose');


const Router = require('koa-router');
const { health } = require('./controllers/health');
const userController = require('./controllers/user');
const walletController = require('./controllers/wallet.js');
const cardVerifyController = require('./controllers/cardController');
const passwordController = require('./controllers/password');
const depositController = require('./controllers/deposit');
const orderController = require('./controllers/order');

const routers = new Router();
const authenticate = require('./middlewares/authenticate');
const verifyEmailsController = require('./controllers/email');
// related with adding products
const productsController = require('./controllers/product');
const statementController = require('./controllers/statement');

//related with payment
const paymentController = require('./controllers/payment');
//related with transfer
const transferController = require('./controllers/transfer');
//related with transaction
const transactionController = require('./controllers/transaction');

routers.get('/', health);

routers.post('/users', userController.register);
routers.put('/users', koaCompose([authenticate, upload.single('images')]), userController.createUser);  // add user details

routers.post('/login', userController.login);

routers.post('/email/verify', authenticate, verifyEmailsController.verifyEmail);
routers.post('/email/confirm', authenticate, verifyEmailsController.confirmEmail);

routers.post('/card/verify', authenticate, cardVerifyController.verifycard);

routers.post('/wallet', authenticate, walletController.createWallet);
routers.get('/wallet', authenticate, walletController.getWallet);

routers.post('/password/forget', passwordController.checkEmail);
routers.post('/password/otpconfirm', passwordController.confirmOTPEmail);
routers.post('/password/passconfirm', authenticate, passwordController.resetPassword);

routers.post('/email/changeEmail', authenticate, verifyEmailsController.changeEmail);
routers.post('/email/confirmNewEmail', authenticate, verifyEmailsController.confirmNewEmail);

routers.post('/deposit', authenticate, depositController.depositWallet);

routers.post('/products', upload.single('images'), productsController.createProducts);

routers.get('/products', authenticate, productsController.getProducts);

routers.post('/payment', authenticate, paymentController.makePayment);
routers.post('/transfer', authenticate, transferController.transferMoney);

routers.post('/order', authenticate, orderController.makeOrder);
routers.get('/order', authenticate, orderController.getOrderDetails);
routers.get('/transactions/:walletId', authenticate, transactionController.getTransaction);

module.exports = routers;
routers.get('/statement/:walletId/:month/:year',statementController.getStatement);
//routers.get('/transaction', statementController.registerTransaction);
