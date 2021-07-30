const variables = require("../variables");
const mongoose = require("mongoose");
const md5 = require("md5");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/summer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


const ObjectId = Schema.ObjectId;


const cardSchema = new Schema({

    userId: String,
    cardToken: String,
    status: { type: Number, default : 0 } // O : unused, 1 used.

});
const CardModel = mongoose.model("Cards", cardSchema);

exports.checkDuplicacy = (cardNumber) => {

    return CardModel.findOne({ cardToken: md5(cardNumber) });

};

exports.create = (userId, cardToken, status) => {
    
    return CardModel.create({userId, cardToken, status});
};

exports.checkExist = (userId, cardToken) => {
    return CardModel.findOne({userId, cardToken });

};

exports.updateStatus = (cardToken, status) =>{
    return CardModel.findOneAndUpdate({cardToken, status});
};

