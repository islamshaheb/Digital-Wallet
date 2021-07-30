/** @format */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/summer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const ObjectId = Schema.ObjectId;

const productsschema = new Schema({
  Name: String,
  price: Number,
  image: String,
});

const productsModel = mongoose.model('Products', productsschema);

// Saving Products' information in DB
exports.addProduct = (productInfo) => {
  productsModel.create(productInfo).then(() => {
    return;
  });
};

exports.checkProduct = (productId) => {
  return productsModel.findOne({ _id: productId });
};