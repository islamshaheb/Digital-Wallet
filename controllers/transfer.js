/** @format */

const transferModel = require('../models/Transfer');
const walletModel = require('../models/Wallets');
const productModel = require('../models/Product');
const variables = require('../variables/index');
const currencyConverter = require('../models/Currency');
exports.transferMoney = async (ctx) => {
  try {
    const { userid } = ctx.request.headers;
    const requestBody = ctx.request.body;
    const { fromWallet, toWallet } = ctx.request.body;
    let amount = requestBody.amount;
    const maxAllowedTransferPerDay = variables.maximumAllowedTransfer;
    const maximumAllowedTransferAmount = variables.maximumAllowedTransferAmount;

    const hasFromWallet = await walletModel.findWalletInfo(fromWallet, userid);

    if (fromWallet === toWallet) {
      throw {
        status: 400,
        message: "Both wallet can't be same!!!",
      };
    }
    if (!hasFromWallet) {
      throw {
        status: 400,
        message: 'Your wallet number is invalid or inactive. Please enter correct one!!!',
        data: {
          walletNumber: fromWallet,
        },
      };
    }

    const totalNumberOfTransfer = await transferModel.countTotalTransfer(userid);

    if (maxAllowedTransferPerDay <= totalNumberOfTransfer) {
      throw {
        status: 400,
        message: `Per day transfer limit crossed!`,
        data: {
          maxAllowedTransferPerDay,
        },
      };
    }

    const hasToWallet = await walletModel.findWalletNumber(toWallet);
    let amountInDolar = amount;
    if (hasFromWallet.currency != 'USD') {
      amountInDolar = await currencyConverter.convertCurrency(
        hasFromWallet.currency,
        hasToWallet.currency,
        amount
      );
      amountInDolar = amountInDolar.data.convertedAmount;
    }

    if (amountInDolar > maximumAllowedTransferAmount) {
      throw {
        status: 400,
        message: `Maximum transfer limit crossed!`,
        data: {
          amountInDolar,
        },
      };
    }

    if (!hasToWallet) {
      throw {
        status: 400,
        message: 'Receiver wallet number is invalid or inactive. Please enter correct one!!',
        data: {
          walletNumber: toWallet,
        },
      };
    }

    const currentBalanceOfSender = hasFromWallet.balance;
    const currentBalanceOfReciver = hasToWallet.balance;

    if (amount > currentBalanceOfSender) {
      throw {
        status: 402,
        message: 'Insufficient amount,Please recharge !!!',
        data: {
          walletNumber: toWallet,
          currentAmount: currentBalanceOfSender,
          amount,
        },
      };
    }

    const newBalanceForSender = currentBalanceOfSender - amount;
    if (hasToWallet.currency !== hasFromWallet.currency) {
      const ConvertedToDolar = await currencyConverter.convertCurrency(
        hasFromWallet.currency,
        hasToWallet.currency,
        amount
      );
      amount = ConvertedToDolar.data.convertedAmount;
    }
    const newBalanceForReceiver = currentBalanceOfReciver + amount;

    await walletModel.balanceUpdate(hasFromWallet._id, newBalanceForSender);
    await walletModel.balanceUpdate(hasToWallet._id, newBalanceForReceiver);

    const transferObject = {
      userId: userid,
      fromWallet,
      toWallet,
      currency: hasToWallet.currency,
      amount,
      Date: new Date(),
    };

    const transferId = await transferModel.create(transferObject);
    ctx.body = {
      message: 'Successfully transferred money.',
      transactionId: transferId,
    };
  } catch (e) {
    const { status, message, error, data } = e;
    ctx.status = status || 500;
    ctx.body = { message, error, data };
  }
};
