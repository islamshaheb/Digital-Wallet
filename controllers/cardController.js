"use strict";

const Validator = require("validatorjs");
const moment = require('moment');
const valid = require("card-validator");
const md5 = require("md5");
const cardModel = require("../models/Card");


const verifyRules = {
    cardNumber: "required",
    expiryDate: "required",
    CVN: "required",
    status: "required"
};

exports.verifycard = async (ctx) => {
    try {
        const { userid } = ctx.request.headers;
        const request = ctx.request.body;
        const validation = new Validator(request, verifyRules);
        if (validation.fails()) {
            throw {
                status: 400,
                message: "Invalid Card",
                error: validation.errors.all()
            };
        }


        //Checking CardNumber 
        const cardNumberValidation = valid.number(request.cardNumber);
        if (!cardNumberValidation.isValid) {
            throw {
                status: 400,
                message: "The Card Number is Not Valid"
            };

        }



        //Checking Duplicate Card

        const hasDuplicate = await cardModel.checkDuplicacy(request.cardNumber);
        if (hasDuplicate) {
            throw {
                status: 400,
                message: "This Card is Already Added in Server"
            };
        }




        //Checking Expiry Date

        const expdate = request.expiryDate;

        if (moment().isAfter(expdate)) {
            throw {
                status: 400,
                message: "Card expiry date is over"
            };

        }


        //Checking CVN number
        const cardCvvValidation = valid.cvv(request.CVN);
        if (!cardCvvValidation.isValid) {
            throw {
                status: 400,
                message: "The CVV number of this card is invalid"

            };
        }

        const token = md5(request.cardNumber);
        const status = request.status;

        await cardModel.create(userid, token, status);


        ctx.body = {

            message: "Card verified successfully",
            token: token
        };
    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 500;
        ctx.body = { message, error };
    }
};