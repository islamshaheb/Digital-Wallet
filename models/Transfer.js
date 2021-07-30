/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/summer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const transferSchema = new Schema({
  userId: String,
  fromWallet: Number,
  toWallet: Number,
  currency: String,
  amount: Number,
  Date: Date,
});

const transferModel = mongoose.model('Transactions', transferSchema);

// Saving transfer with inforamtion and return transferId
exports.create = async (transferInfo) => {
  const transferInformation = await transferModel.create(transferInfo);
  return transferInformation._id;
};
exports.countTotalTransfer = (userId) => {
  return transferModel
    .find({ userId }, { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
    .count();
};

exports.getAllTransferInformation = (userId, walletNumber) => {
  return transferModel.find({ $and: [{ userId }, { fromWallet: walletNumber }] });
};

exports.getAllTransferInformationByDate = (userId, walletNumber, tempstartDate, tempendDate) => {
  let startDate = '',
    endDate = '';
  for (let i = 0; i <= 22; i++) {
    startDate += tempstartDate[i];
    endDate += tempendDate[i];
  }
  startDate += 'Z';
  endDate += 'Z';
  return transferModel.find({
    $and: [
      { userId },
      { fromWallet: walletNumber },
      {
        Date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    ],
  });
};
exports.getTransaction = (walletNumber, month, year) => {
   const firstDay = new Date(`${year}-${month}-01`);
   const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth()+1,firstDay.getDate()-1);

  return transferModel.find(
    {$and:[
      {Date:{
        $gte:firstDay,
        $lt :lastDay
      }},
      {$or:[
        {fromWallet:walletNumber},{toWallet:walletNumber}
    ]}
    ]

});

 };
