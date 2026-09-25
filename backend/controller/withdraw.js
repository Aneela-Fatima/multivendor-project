const express = require("express");
const Withdraw = require("../model/withdraw");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();

// CREATE WITHDRAW REQUEST (SELLER ONLY)
const createWithdrawRequest = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return next(new ErrorHandler("Please provide a valid amount", 400));
      }

      // Check if seller want to withdraw more than balance
      if (req.seller.availableBalance < amount) {
        return next(new ErrorHandler("Insufficient balance!", 400));
      }

      const withdrawData = {
        seller: req.seller,
        amount,
      };

      // Create withdraw record
      const withdraw = await Withdraw.create(withdrawData);

      // Deduct from seller's available balance
      const shop = await Shop.findById(req.seller._id);
      shop.availableBalance = shop.availableBalance - amount;
      await shop.save();

      // Send email notification
      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3 to 7 days to process!`,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
      }

      res.status(201).json({
        success: true,
        withdraw,
        message: "Withdraw request submitted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


// GET ALL WITHDRAW REQUESTS (ADMIN ONLY)=
const getAllWithdraws = catchAsyncErrors(async (req, res, next) => {
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdraws,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// UPDATE WITHDRAW STATUS (ADMIN ONLY)
const updateWithdrawStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;

    const withdraw = await Withdraw.findById(id);

    if (!withdraw) {
      return next(new ErrorHandler("Withdraw request not found!", 404));
    }

    if (withdraw.status === "succeed") {
      return next(new ErrorHandler("Withdraw already processed!", 400));
    }

    // Update withdraw status
    withdraw.status = "succeed";
    withdraw.updatedAt = Date.now();
    await withdraw.save();

    // Add transaction to seller's transections
    const seller = await Shop.findById(sellerId);

    if (seller) {
      const transaction = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transaction];
      await seller.save();

      // Send email notification
      try {
        await sendMail({
          email: seller.email,
          subject: "Payment Confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules — it usually takes 3 to 7 days.`,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
      }
    }

    // Fetch updated list
    const updatedWithdraws = await Withdraw.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdraw,
      withdraws: updatedWithdraws,
      message: "Withdraw request updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/create-withdraw-request", isSeller, createWithdrawRequest);
router.get("/get-all-withdraw-request", isAuthenticated, isAdmin("Admin"), getAllWithdraws);
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  updateWithdrawStatus,
);

module.exports = router;