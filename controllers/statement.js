"use strict";

const Validator = require("validatorjs");
const errorHandler = require("../helpers/errorHandler");
const transferModel = require("../models/Transfer");
const userModel = require("../models/Users");
const variables = require("../variables/index");
const { prepareStatement } = require("../helpers/statementTemplate");
const walletModel = require("../models/Wallets");
const htmlToPdf = require("html-pdf");
const options = { format: "A4" };

exports.getStatement = async (ctx) => {
  try {
    const { userid: userId } = ctx.request.headers;
    //const userId="60ec43de7278ec3098caba6d";
    const { walletId, month, year } = ctx.params;
    const { walletNumber, currency, balance } =
      await walletModel.findWalletNumber(walletId, userId);
    const transactionData = await transferModel.getTransaction(
      walletNumber,
      month,
      year
    );
    const accountNumber=walletNumber.toString();
    const { fullName } = await userModel.checkUser(userId);
    const { txnList, totalDebit, totalCredit } = formatData(transactionData,walletNumber);
    const statement = await prepareStatement({
      name: fullName,
      accountNo: accountNumber,
      currency,
      balance,
      totalCredit,
      totalDebit,
      transactions: txnList
    });
    const pdf = await new Promise((resolve, reject) => {
      htmlToPdf.create(statement).toBuffer((err, buffer) => {
        //console.log("This is a buffer:", Buffer.isBuffer(buffer));
        resolve(buffer);
      });
    });
    ctx.type = "application/pdf";
    ctx.body = pdf;

    // console.log(isMatch);
  } catch (e) {
    const { status, message, error } = e;

    ctx.status = status||500;
    ctx.body = { message, error };
  }
};

const formatData = (transaction,walletNumber) => {
  let totalDebit = 0;
  let totalCredit = 0;
  let txnList = [];
  for (let i=0;i<transaction.length;i++) {
   
    if (transaction[i].fromWallet == walletNumber) {
      transaction[i]['type']="Debit";
      totalDebit += transaction[i].amount;
    } else {
      totalCredit += transaction[i].amount;
      transaction[i]['type']="Credit";
    }
    txnList.push(transaction[i]); // format if necessary
  }
  return { txnList, totalDebit, totalCredit };
};