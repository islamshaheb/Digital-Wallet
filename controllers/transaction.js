/** @format */

const transferModel = require('../models/Transfer');
const depositModel = require('../models/Deposit');

exports.getTransaction = async (ctx) => {
  try {
    const { walletId } = ctx.params;
    let { userid } = ctx.request.headers;
    const query = ctx.query;
    const querySize = Object.keys(query).length;
    let allInformationOfTransaction, allInformationOfDeposit;
    if (querySize) {
      const { startDate, endDate } = ctx.query;
      allInformationOfTransaction = await transferModel.getAllTransferInformationByDate(
        userid,
        walletId,
        startDate,
        endDate
      );
      allInformationOfDeposit = await depositModel.getAllDepositInformationByDate(
        userid,
        walletId,
        startDate,
        endDate
      );
    } else {
      allInformationOfTransaction = await transferModel.getAllTransferInformation(userid, walletId);
      allInformationOfDeposit = await depositModel.getAllDepositInformation(userid, walletId);
    }
    ctx.body = {
      status: 200,
      message: `Sccuessfully Fatched Information `,
      allInformationOfDeposit,
      allInformationOfTransaction,
    };
  } catch (err) {
    const { status, message, error } = err;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};
