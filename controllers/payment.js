/** @format */

const paymentModel = require('../models/Payment');
const walletModel = require('../models/Wallets');
const productModel = require('../models/Product');

exports.makePayment = async (ctx) => {
  try {
    const { userid } = ctx.request.headers;
    const requestBody = ctx.request.body;
    const productId = requestBody.productId;
    const hasWallet = await walletModel.findWalletInfo(requestBody.walletNumber, userid);

    if (!hasWallet) {
      throw {
        status: 400,
        message: 'No wallet exist with given ID',
        walletNumber: requestBody.walletNumber,
      };
    }

    // check validaty of product Id
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      throw {
        status: 400,
        message: 'Invalid product ID, Insert correct one !!!',
        data: {
          productId,
        },
      };
    }

    const hasProduct = await productModel.checkProduct(productId);
    if (!hasProduct) {
      throw {
        status: 400,
        message: 'No products exist with given product ID',
        data: {
          productId,
        },
      };
    }

    const walletBalance = hasWallet.balance;
    const productPrice = hasProduct.price;

    if (productPrice > walletBalance) {
      throw {
        status: 402,
        message: 'Insufficient amount,Please recharge !!!',
        data: {
          walletNumber: requestBody.walletNumber,
          currentAmount: hasWallet.balance,
          productPrice,
        },
      };
    }

    const newBalance = walletBalance - productPrice;
    await walletModel.balanceUpdate(hasWallet._id, newBalance);

    const status = 1;
    const paymentObject = {
      productId,
      walletId: hasWallet._id,
      amount: productPrice,
      time: new Date(),
      status
    };

    const paymentId = await paymentModel.create(paymentObject);
    ctx.body = {
      message: 'Payment is successful',
      paymentId,
      newBalance,
    };
  } catch (e) {
    const { status, message, error, data } = e;
    ctx.status = status || 500;
    ctx.body = { message, error, data };
  }
};
