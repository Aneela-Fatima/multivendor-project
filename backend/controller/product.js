const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order")
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");

// create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invelid", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);
        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productData = await Product.findById(productId);

      productData.images.forEach(imageUrl => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;


        fs.unlink(filePath,(err)=>{
          if(err){

          }
        })
      });
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(
          new ErrorHandler("Product not found with with this id!", 500),
        );
      }

      res.status(201).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);

// get all products (all shops)
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);

// review for a product
export const productReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { rating, comment, productId, orderId } = req.body;
    const userId = req.user._id; // user from Middleware

    // Fetch product & order
    const [product, order] = await Promise.all([
      Product.findById(productId),
      Order.findById(orderId),
    ]);

    if (!product) return next(new ErrorHandler("Product not found!", 404));
    if (!order) return next(new ErrorHandler("Order not found!", 404));

    // Authorization check — convert to string for safe comparison
    if (!order.user?._id || order.user._id.toString() !== userId.toString()) {
      return next(new ErrorHandler("Unauthorized!", 403));
    }

    const cartItem = order.cart.find(
      (item) => item._id.toString() === productId.toString(),
    );
    if (!cartItem) return next(new ErrorHandler("Product not in order!", 404));
    if (cartItem.isReviewed) {
      return next(new ErrorHandler("Already reviewed!", 400));
    }
    // User object for review
    const reviewObj = {
      _id: userId,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    };

    // Add/Update review
    const existingReview = product.reviews.find(
      (rev) => rev.user._id.toString() === userId.toString(),
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      existingReview.user = reviewObj;
    } else {
      product.reviews.push({
        user: reviewObj,
        rating: Number(rating),
        comment,
        productId,
      });
    }
     // Recalculate average rating
    product.ratings =
      product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    // Mark as reviewed in order
    await Order.findOneAndUpdate(
      { _id: orderId, "cart._id": productId },
      { $set: { "cart.$.isReviewed": true } },
    );

    res.status(200).json({
      success: true,
      message: "Review submitted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// GET ALL PRODUCTS (ADMIN ONLY)
export const getAllAdminProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
module.exports = router;
