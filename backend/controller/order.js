const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");

// Create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      if (!paymentInfo || paymentInfo.type !== "Cash On Delivery") {
        return next(new ErrorHandler("Only Cash On Delivery is available", 400));
      }

      // Group cart items by Shop ID
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // Create an individual order document per shop, each billed for only
      // that shop's items (not the whole cart's total).
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const shopTotalPrice = items.reduce(
          (sum, item) => sum + Number(item.discountPrice || 0) * Number(item.qty || 1),
          0,
        );

        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice: shopTotalPrice,
          paymentInfo: {
            type: "Cash On Delivery",
            status: "Not Paid",
          },
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// Get all orders for user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// Get all orders for seller/shop
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// update order status for seller
const updateStatusOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    if (req.body.status === "Transferred to delivery partner") {
      for (const o of order.cart) {
        await updateProductStock(o._id, o.qty);
      }
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      if (order.paymentInfo) {
        order.paymentInfo.status = "Paid";
      }
      const serviceCharge = order.totalPrice * 0.1;
      await updateSellerBalance(order.totalPrice - serviceCharge);
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });
    // Helper Functions
    async function updateProductStock(productId, qty) {
      const product = await Product.findById(productId);
      if (product) {
        product.stock -= qty;
        product.sold_out += qty;
        await product.save({ validateBeforeSave: false });
      }
    }

    async function updateSellerBalance(amount) {
      const seller = await Shop.findById(req.seller.id);
      if (seller) {
        seller.availableBalance = (seller.availableBalance || 0) + amount;
        await seller.save();
      }
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// order refund user
const orderRefund = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    order.status = req.body.status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: "Order Refund Request successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// refund succcess -- seller
const orderRefundSuccess = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    if (order.status === "Refund Success") {
      return next(new ErrorHandler("Refund already processed!", 400));
    }

    order.status = req.body.status;
    await order.save();

    if (req.body.status === "Refund Success") {
      for (const o of order.cart) {
        await updateProductStockOnRefund(o._id, o.qty);
      }
      /* Every order belongs to a single shop only (createOrder splits multi-shop carts into separate orders per shop at checkout time),so taking the shopId from the first cart item is safe here.*/
      const shopId = order.cart[0]?.shopId;
      if (shopId) {
        const seller = await Shop.findById(shopId);
        if (seller) {
          /* Seller only received 90% at delivery time (10% was admin's commission), so refund only deducts that same 90% share back.*/
          const refundAmount = order.totalPrice * 0.9;
          seller.availableBalance =
            (seller.availableBalance || 0) - refundAmount;
          await seller.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Order Refund successful!",
    });

    async function updateProductStockOnRefund(productId, qty) {
      const product = await Product.findById(productId);
      if (product) {
        product.stock += qty;
        product.sold_out -= qty;
        await product.save({ validateBeforeSave: false });
      }
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// get all orders --admin
const getAllAdminOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.put("/update-order-status/:id", isSeller, updateStatusOrder);
router.put("/order-refund-success/:id", isSeller, orderRefundSuccess);
router.get("/admin-all-orders", isAuthenticated, isAdmin("Admin"), getAllAdminOrders);

module.exports = router;
