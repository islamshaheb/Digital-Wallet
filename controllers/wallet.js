"use strict";

const errorHandler = require("../helpers/errorHandler");
const walletModel = require('../models/Wallets');
const mongoose = require("mongoose");
const variables = require("../variables/index.js");

const  getRandomWalletNumber = async () =>{
    const str =  (Math.random()+' ').substring(2,10) + (Math.random()+' ').substring(2,10);    
    let walletNumber = parseInt(str); 

    while(walletNumber < 1E15){
        walletNumber = walletNumber * 10;
    }
    
    const hasDuplicate = await walletModel.checkWalletNumberDuplicacy(walletNumber);

    if(!hasDuplicate){
        return walletNumber;
    }
    getRandomWalletNumber();
}

const isCurrencyAllowed = (currency) =>{
    return variables.allowedCurrencies.indexOf(currency) >  -1 ? true : false; 
}

exports.createWallet = async (ctx) => {
  try {
    const userId = ctx.request.header.userid;
    const currency = ctx.request.body.currency.toUpperCase();

    const walletNumber = await getRandomWalletNumber();
    const currencyAllowed =  isCurrencyAllowed(currency);

    if(!currencyAllowed){
      throw{
        status: 400,
        message: "Currency Not Allowed.Please choose currency BDT or USD"
      }
    }

    const hasDuplicate = await walletModel.checkWalletDuplicacy(userId, currency.toUpperCase());

    if(hasDuplicate){
      throw{
        status: 400,
        message: "Cannot process request. Wallet already exists."
      }
    }

    const walletInfo = {
        userId, 
        currency: currency.toUpperCase(),
        walletNumber,
        balance: 0.00,
        active: true
    };

    const returnedWalletInfo= await walletModel.create(walletInfo);

    ctx.body = {
      data: returnedWalletInfo,
      status: 200,
      message: "Successfully created wallet."
    };
  } catch (e) {
    const { status, message, error } = e;
    ctx.status = status||500;
    ctx.body = { message, error };
  }
};

exports.getWallet = async (ctx) => {
  try {

    const userId = ctx.request.headers.userid;

    if(!userId){
      throw{
        status: 401,
        message: "Cannot process request. User is not authorized"
      }
    }


    const returnedWalletInfo = await walletModel.findWallet(userId);

    ctx.body = {
      data: returnedWalletInfo,
      status: 200,
      message: "Successfully fetched wallet/s."
    };
  } catch (e) {

    const { status, message, error } = e;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};
