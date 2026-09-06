const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const JWT = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop")

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 400));
  }

  const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);
  next();
});


exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 400));
  }

  const decoded = JWT.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await Shop.findById(decoded.id);
  next();
});