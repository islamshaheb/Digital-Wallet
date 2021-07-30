/** @format */

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

const userSchema = new Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  password: String,
  image: String
});
const UserModel = mongoose.model("Users", userSchema);

exports.checkDuplicacy = (email) => {
  return UserModel.findOne({ email });
};
exports.checkExistence = (email, password) => {
  //console.log((1));

  return UserModel.findOne({ email, password: md5(password) });
};

exports.create = (userInfo) => {
  userInfo.password = md5(userInfo.password);
  //console.log(userInfo);
  return UserModel.create(userInfo);
};

exports.checkUser = (id) => {
  //return { fullNme: "Shuhail alam" };
  return UserModel.findOne({ _id: id });
};

//checkExistMail
exports.checkMailId = (emailInfo) => {
  return UserModel.findOne({ email: emailInfo });
};

//checkuserDetails for Reset password

exports.checkDetails = (_id, email) => {
  return UserModel.findOne({ _id, email });
};

//User password Updated

exports.updatePassword = (userid, password) => {
  return UserModel.findOneAndUpdate({ _id: userid, password });
};
exports.updateUser = (userId, newEmail) => {
  return UserModel.findOneAndUpdate(
    { _id: userId },
    { email: newEmail },
    { new: true }
  );
};

exports.updateUserInfo = async(userId, userInfo) => {
    return await UserModel.findOneAndUpdate({_id: userId}, userInfo);
}

//finding user details for order 
exports.findUser = (userid)=>{
  return UserModel.findOne({_id: userid});
};


