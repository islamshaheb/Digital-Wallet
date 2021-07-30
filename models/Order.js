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

const orderSchema = new Schema({
    paymentId: String,
    productId: String,
    userId: String,
    Date: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.model('order', orderSchema);

exports.create = (orderInfo) => {
    return orderModel.create(orderInfo);
};

exports.findOrder = (userId) => {
    return orderModel.find({ userId });
};

exports.checkOrder = (paymentId) => {
    return orderModel.findOne({ paymentId });
};
