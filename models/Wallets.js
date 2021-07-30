/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/summer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const ObjectId = Schema.ObjectId;

const walletSchema = new Schema({
  userId: String,
  currency: String,
  walletNumber: Number,
  balance: Number,
  active: Boolean,
});

const walletModel = mongoose.model('Wallet', walletSchema);

exports.checkWalletNumberDuplicacy = async (walletNumber) => {
  return await walletModel.findOne({ walletNumber });
};

exports.checkWalletDuplicacy = async (userId, currency) => {
  return await walletModel.findOne({ userId, currency });
};

exports.create = async (walletInfo) => {
  return await walletModel.create(walletInfo);
};


exports.findWalletNumber = async (walletId, userId) => {
  //return { walletNumber: "5789485632", currency: "USD", balance: 1689.0 };
  return await walletModel.findOne({ _id: walletId, userId });
};
exports.findWallet = async (userId) => {
  return await walletModel.find({ userId });
};

exports.findWalletInfo = (walletNumber, userId) => {
  return walletModel.findOne({
    $and: [{ walletNumber: walletNumber }, { active: true }, { userId }],
  });
};

exports.balanceUpdate = (walletId, newBalance) => {
  return walletModel.findOneAndUpdate({ _id: walletId }, { balance: newBalance });
};

exports.findWalletUSD = async (userId, currency) => {
  return walletModel.findOne({ userId, currency });
};

exports.depositBalance = async (walletNumber, balance) => {
  return walletModel.findOneAndUpdate({ walletNumber, balance });
};
