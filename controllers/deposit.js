"use strict";
const cardModel = require("../models/Card");
const walletModel = require("../models/Wallets");
const depositModel = require("../models/Deposit");


exports.depositWallet = async (ctx) => {
    try {
        const { userid } = ctx.request.headers;
        const { cardToken, amount } = ctx.request.body;

        const cardExist = await cardModel.checkExist(userid, cardToken);
        if (!cardExist) {
            throw {
                status: 400,
                message: "The Card does not exist  or Not verified by the user"

            };
        }

        if (cardExist.status === 1) {
            throw {
                status: 400,
                message: "The Card has been already used"

            };
        }

        if (!Number.isInteger(amount)) {
            throw {
                status: 400,
                message: "Deposit amount must be Number"

            };
        }

        if (amount > 100) {
            throw {
                status: 400,
                message: "The amount must be less or equal 100 USD"
            };

        }

        const wallet = await walletModel.findWalletUSD(userid, "USD");

        const walletDepositLimit = await depositModel.findWalletLimit(wallet.walletNumber, new Date().toISOString().slice(0, 10));

        if (walletDepositLimit >= 3) {
            throw {
                status: 400,
                message: "Deposit limit of the day has exceeded"
            };
        }


        wallet.balance = wallet.balance + amount;
        cardExist.status = 1;

        await walletModel.depositBalance(wallet.walletNumber, wallet.balance);
        await cardModel.updateStatus(cardExist.cardToken, cardExist.status);
        await depositModel.createDepositDetails(userid, wallet.walletNumber);

        ctx.body = {
            message: "The amount is deposit successfully"
        };


    } catch (e) {
        const { status, message, error } = e;
        ctx.status = status || 500;
        ctx.body = { message, error };

    }

};