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

const ObjectId = Schema.ObjectId;

const paymentSchema = new Schema({
  productId: String,
  walletId: String,
  amount: Number,
  time: Date,
  status: { type: Number, default: 0 }
});

const paymentModel = mongoose.model('payment', paymentSchema);

// Saving payment with inforamtion and return paymentId
exports.create = async (paymentInfo) => {
  const paymentInformation = await paymentModel.create(paymentInfo);
  return paymentInformation._id;
};

exports.findPayment = async (paymentId) => {
  return paymentModel.findOne({ _id: paymentId });
};
