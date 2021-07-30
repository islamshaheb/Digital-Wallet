/** @format */
const utility = require('../helpers/utilities');
const productModel = require('../models/Product');
const variables = require('../variables/index');

exports.createProducts = async (ctx) => {
  try {
    const requestBody = ctx.request.body;
    const convertedImage = await utility.toaBase64(ctx.file.buffer);
    const maxSize = variables.maximumImageSize;

    // Ignore if file size is bigger than 50kb
    if (ctx.file.size > maxSize * 1024) {
      throw {
        status: 400,
        message: `File size has to  be less than ${maxSize}kb `,
      };
    }
    if (isNaN(requestBody.price)) {
      throw {
        status: 400,
        message: 'Bad request !!',
      };
    }

    // saving products related informations onto the database

    const productPrice = parseInt(requestBody.price);

    const information = {
      Name: requestBody.name,
      price: productPrice,
      image: convertedImage,
    };
    await productModel.addProduct(information);
    ctx.body = {
      status: 200,
      message: `Sccuessfully saved information `,
    };
  } catch (err) {
    const { status, message, error } = err;
    ctx.status = status;
    ctx.body = { message, error };
  }
};

exports.getProducts = async (ctx) => {
  try {
    const productID = ctx.request.body.id;
    const productList = await productModel.checkProduct();
    if (!productList) {
      throw {
        status: 404,
        message: 'No product found !!',
      };
    }
    ctx.body = {
      message: 'Products found !!',
      Products: productList,
    };
  } catch (e) {
    const { status, message, error } = e;
    ctx.status = status;
    ctx.body = { message, error };
  }
};
