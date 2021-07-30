/** @format */

const variables = require('../variables');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/summer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const depositSchema = new Schema({
  userId: String,
  walletNumber: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});
const DepositModel = mongoose.model('deposit', depositSchema);

exports.findWalletLimit = (walletNumber, dateToday) => {
  return DepositModel.countDocuments({ walletNumber, date: { $gte: dateToday } });
};

exports.createDepositDetails = (userId, walletNumber) => {
  return DepositModel.create({ userId, walletNumber });
};
exports.getAllDepositInformation = (userId, walletNumber) => {
  return DepositModel.find({ $and: [{ userId }, { walletNumber }] });
};

exports.getAllDepositInformationByDate = (userId, walletNumber, tempstartDate, tempendDate) => {
  let startDate = '',
    endDate = '';
  for (let i = 0; i <= 22; i++) {
    startDate += tempstartDate[i];
    endDate += tempendDate[i];
  }
  startDate += 'Z';
  endDate += 'Z';
  return DepositModel.find({
    $and: [
      { userId },
      { walletNumber },
      {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    ],
  });
};
