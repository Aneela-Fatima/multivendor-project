const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");

// crete coupoun code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existingCoupon = await CoupounCode.findOne({
        name: req.body.name,
      });

      if (existingCoupon) {
        return next(new ErrorHandler("Coupoun Code already exists!", 400));
      }

      const coupounCode = await CoupounCode.create(req.body);

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Unable to create coupon code", 400),
      );
    }
  }),
);

//  get all coupons of shop
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.find({
        $or: [{ shop: req.params.id }, { "shop._id": req.params.id }],
      });

      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Unable to fetch coupons", 400),
      );
    }
  }),
);

module.exports = router;
