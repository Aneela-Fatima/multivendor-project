const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const JWT = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 400));
  }

  const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

  req.authId = decoded.id;
  req.user = await User.findById(decoded.id);
  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { ["seller-token"]: sellerToken } = req.cookies;

  if (!sellerToken) {
    return next(new ErrorHandler("Please login to continue", 400));
  }

  const decoded = JWT.verify(sellerToken, process.env.JWT_SECRET_KEY);

  req.authId = decoded.id;
  req.seller = await Shop.findById(decoded.id);
  next();
});

exports.isAuthenticatedOrSeller = catchAsyncErrors(async (req, res, next) => {
  const userToken = req.cookies.token;
  const sellerToken = req.cookies["seller-token"];

  if (!userToken && !sellerToken) {
    return next(new ErrorHandler("Please login to continue", 400));
  }

  const actorId = req.body?.sender || req.body?.lastMessageId;
  const sellerDecoded = sellerToken
    ? JWT.verify(sellerToken, process.env.JWT_SECRET_KEY)
    : null;
  const userDecoded = userToken
    ? JWT.verify(userToken, process.env.JWT_SECRET_KEY)
    : null;
  const decoded =
    actorId && userDecoded?.id === actorId
      ? userDecoded
      : actorId && sellerDecoded?.id === actorId
        ? sellerDecoded
        : sellerDecoded || userDecoded;

  req.authId = decoded.id;

  if (sellerDecoded?.id === decoded.id) {
    req.seller = await Shop.findById(decoded.id);
  } else {
    req.user = await User.findById(decoded.id);
  }

  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`),
      );
    }
    next();
  };
};
