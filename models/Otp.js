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

const OTPschema = new Schema({
  userID: String,
  email: String,
  OTP: String,
  expireAt: {
    type: Date,
    validate: [
      function (v) {
        return v - new Date() <= 180000;
      },
      'Cannot expire more than 180 seconds in the future.',
    ],
    default: function () {
      // 180 seconds from now
      return new Date(new Date().valueOf() + 180000);
    },
  },
});

const OTPModel = mongoose.model('OTP', OTPschema);

// Saving OTP with user_id
exports.create = (OTPInfo) => {
  return OTPModel.create(OTPInfo);
};

//checking OTP is there with user_id or not
exports.checkExistence = (ID, otp) => {
  return OTPModel.findOne({ userID: ID, OTP: otp });
};

// delete if need
exports.deleteOTP = (ID, otp) => {
  return OTPModel.remove({ userID: ID, OTP: otp });
};

// check mail and otp
exports.checkExistOTPEmail = (email, OTP) => {
  return OTPModel.findOne({ email, OTP });
};
