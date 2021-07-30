/** @format */

'use strict';

const createOTP = require('../helpers/utilities');
const OTPModel = require('../models/Otp');
const userModel = require('../models/Users');
const emailModel = require('../models/Email');

// verify mail and send otp through sendgrid
exports.verifyEmail = async (ctx) => {
  try {
    const { userid } = ctx.request.headers;

    const hasEmail = await userModel.checkUser(userid);
    if (!hasEmail) {
      throw {
        status: 404,
        message: 'No user Found with this mail !!',
      };
    }
    const OTP = await createOTP.createRandomNumber(6);
    const data = {
      userID: userid,
      email: hasEmail.email,
      OTP,
      time: Date.now(),
    };
    // saving OTP related informations onto the database
    await OTPModel.create(data);
    const otpObject = {
      email: hasEmail.email,
      OTP,
      purpose: 'OTP',
    };

    // Sending OTP through email
    // Must have to run the Sendgrid Adapter server,otherwise we will get an error. Beceuse it will wait untill it gets responce
    // if you think you will work with adapter later, then please commented out line number 46

    await emailModel.send(otpObject);

    ctx.body = {
      status: 200,
      message: 'OTP has been sent successfully !',
    };
  } catch (e) {
    const { status, message, error } = e;

    ctx.status = status;
    ctx.body = { message, error };
  }
};

// confirm OTP and eamil is correct or not
exports.confirmEmail = async (ctx) => {
  try {
    const { userid } = ctx.request.headers;

    const OTP = ctx.request.body.OTP;
    const hasOTP = await OTPModel.checkExistence(userid, OTP);
    
    if (!hasOTP) {
      throw {
        status: 400,
        message: 'OTP is incorrent',
        data: hasOTP,
      };
    }
    await OTPModel.deleteOTP(userid, OTP);
    ctx.body = {
      message: 'Your eamil  is verified',
      Email: hasOTP.email,
    };
  } catch (e) {
    const { status, message, error, data } = e;

    ctx.status = status;
    ctx.body = { message, error, data };
  }
};
exports.changeEmail = async (ctx) => {
  try {
    const userId = ctx.request.headers.userid;
    const newEmail = ctx.request.body.newEmail;

    if (!userId) {
      throw {
        status: 404,
        message: 'No user Found with this mail !!',
      };
    }
    const OTP = await createOTP.createRandomNumber(6);

    const data = {
      userID: userId,
      email: newEmail,
      OTP,
      time: Date.now(),
    };

    // saving OTP related informations onto the database
    await OTPModel.create(data);

    const otpObject = {
      email: newEmail,
      OTP,
      purpose: 'OTP',
    };

    // Sending OTP through email
    // Must have to run the Sendgrid Adapter server,otherwise we will get an error. Beceuse it will wait untill it gets responce
    // if you think you will work with adapter later, then please commented out line number 46

    await emailModel.send(otpObject);

    ctx.body = {
      status: 200,
      message: 'OTP has been sent successfully !',
      data,
    };
  } catch (e) {
    const { status, message, error } = e;

    ctx.status = status;
    ctx.body = { message, error };
  }
};

exports.confirmNewEmail = async (ctx) => {
  try {
    const request = ctx.request.body;
    const userId = ctx.request.headers.userid;
    const OTP = request.OTP;
    const newEmail = request.newEmail;

    const hasOTP = await OTPModel.checkExistence(userId, OTP);

    if (!hasOTP) {
      throw {
        status: 400,
        message: 'OTP is incorrent',
        data: hasOTP,
      };
    }
    await userModel.updateUser(userId, newEmail);
    ctx.body = {
      message: 'Your eamil  is changed succesfully',
      Email: hasOTP.email,
    };
  } catch (e) {
    const { status, message, error, data } = e;

    ctx.status = status;
    ctx.body = { message, error, data };
  }
};
