/** @format */

const orderModel = require('../models/Order');
const paymentModel = require('../models/Payment');
const productModel = require('../models/Product');

exports.makeOrder = async (ctx) => {
    try {
        const { userid } = ctx.request.headers;
        const { paymentId } = ctx.request.body;

        const paymentDetails = await paymentModel.findPayment(paymentId);

        if (!paymentDetails) {
            throw {
                status: 400,
                message: "The payment ID does not exist"

            };
        }

        if (paymentDetails.status === 0) {
            throw {
                status: 400,
                message: "The Payment is not completed yet"

            };
        }

        const productDetails = await productModel.checkProduct(paymentDetails.productId);

        if (!productDetails) {
            throw {
                status: 400,
                message: "The product does not exist with this product Id"

            };
        }

        if (productDetails.price !== paymentDetails.amount) {
            throw {
                status: 400,
                message: "The full payment is not completed successfully"
            };
        }


        const orderDetails = await orderModel.checkOrder(paymentId);

        if (orderDetails) {
            throw {
                status: 400,
                message: " Order is already created through this payment Id"

            };
        }



        const orderObject = {
            paymentId,
            productId: paymentDetails.productId,
            userId: userid
        };

        const order = await orderModel.create(orderObject);
        ctx.body = {
            message: 'Order is created successfully',
            data: order
        };
    } catch (e) {
        const { status, message, error, data } = e;
        ctx.status = status || 500;
        ctx.body = { message, error, data };
    }
};


exports.getOrderDetails = async (ctx) => {
    try {
        const { userid } = ctx.request.headers;

        if (!userid) {
            throw {
                status: 400,
                message: " The userId is invalid"

            };
        }

        const orderDetailsList = await orderModel.findOrder(userid);

        if (orderDetailsList.length === 0) {
            throw {
                status: 400,
                message: "The User Id has not any Orders in Queue"
            };
        }

        ctx.body = {
            data: orderDetailsList

        };

    } catch (e) {
        const { status, message, error, data } = e;
        ctx.status = status || 500;
        ctx.body = { message, error, data };

    }

};