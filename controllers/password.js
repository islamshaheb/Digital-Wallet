'use strict';

const createOTP = require('../helpers/utilities');
const otpModel = require('../models/Otp');
const userModel = require('../models/Users');
const emailModel = require('../models/Email');
const variables = require('../variables/index');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

// verify mail and send otp through sendgrid
exports.checkEmail = async (ctx) => {
    try {
        const request = ctx.request.body;

        const existEmail = await userModel.checkMailId(request.email);
        if (!existEmail) {
            throw {
                status: 404,
                message: 'The Email Id does not exist',
            };
        }

        //working 
        const OTP = await createOTP.createRandomNumber(6);

        const data = {
            userID: existEmail._id,
            email: existEmail.email,
            OTP,
            time: Date.now(),
        };

        // saving OTP related informations onto the database
        await otpModel.create(data);

        const otpObject = {
            email: existEmail.email,
            OTP,
            purpose: 'OTP',
        };

        // Sending OTP through email
       await emailModel.send(otpObject);

        ctx.body = {
            status: 200,
            message: 'OTP has been sent successfully !',
        };
    } catch (e) {
        const { status, message, error } = e;

        ctx.status = status || 500;
        ctx.body = { message, error };
    }
};

// confirm OTP and eamil is correct or not
exports.confirmOTPEmail = async (ctx) => {
    try {
        const { email, OTP } = ctx.request.body;

        const hasOtpEmail = await otpModel.checkExistOTPEmail(email, OTP);

        if (!hasOtpEmail) {
            throw {
                status: 400,
                message: 'OTP is incorrect',
                data: hasOtpEmail
            };
        }

        const userInfo = await userModel.checkDetails(hasOtpEmail.userID, hasOtpEmail.email);
        const token = jwt.sign({ userInfo }, variables.secret);
        ctx.body = {
            message: 'Your eamil and OTP are verified',
            token: token
        };

    } catch (e) {
        const { status, message, error, data } = e;

        ctx.status = status || 500;
        ctx.body = { message, error, data };
    }
};

exports.resetPassword = async (ctx) => {
    try {
        const { userid } = ctx.request.headers;
        const { password, comfirmPassword } = ctx.request.body;

        if (password !== comfirmPassword){
            throw{
                status: 400,
                message: "Password and Comfirm Password are not Match"
            };

        }

        const passwordHash  = md5(password);

        await userModel.updatePassword(userid, passwordHash);

        ctx.body = {

            message: "Password Reset and Save Successfully"
        };




        
    } catch (e) {
        const { status, message, error, data } = e;

        ctx.status = status || 500;
        ctx.body = { message, error, data };

    }

};
