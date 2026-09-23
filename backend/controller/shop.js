const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { upload } = require("../multer");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/ShopToken");
const { isAuthenticated } = require("../middleware/auth");
const { isSeller } = require("../middleware/auth");
const Shop = require("../model/shop");
const Product = require("../model/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");


// create shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate Your Shop",
        message: `Hello ${seller.name}, Please click on the link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        succes: true,
        message: `Plaease check your email:- ${seller.email} to activate your shop`,
      });
    } catch (error) {
      if (req.file) fs.unlink(`uploads/${req.file.filename}`, () => {});
      return next(new ErrorHandler(err.message, 500));
    }
  } catch (error) {
    if (req.file) fs.unlink(`uploads/${req.file.filename}`, () => {});
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );
      if (!newSeller)
        return next(new ErrorHandler("Invalid or expired token", 400));

      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;
      let seller = await Shop.findOne({ email });
      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        password,
        avatar: {
          public_id: avatar,
          url: `${req.protocol}://${req.get("host")}/${avatar}`,
        },
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);



// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
      }
      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide correct information!", 400),
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//load shop
router.get(
  "/getSeller",
    isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);


// Logout shop
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      re.cookie("seller-token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      re.status(201).json({
        succes: true,
        message: "LogOut Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);


// get shop info
router.get("/get-shop-info/:id",catchAsyncErrors(async(req,res,next)=>{
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({
      success: true,
      shop,
    })
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))


// update shop avatar
const updateShopAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorHandler("Please select an image", 400));
    }

    const seller = await Shop.findById(req.seller.id);

    if (!seller) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    if (seller.avatar?.public_id) {
      const oldAvatarPath = path.join(
        "uploads",
        path.basename(seller.avatar.public_id),
      );
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    seller.avatar = {
      public_id: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/${req.file.filename}`,
    };
    await seller.save();

    // Update all products of this shop with new shop info
    await Product.updateMany(
      { shopId: seller._id.toString() },
      { $set: { shop: seller } },
    );

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update seller info
const updateShopInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, description, address, phoneNumber, zipCode } = req.body;

    const seller = await Shop.findById(req.seller.id);

    if (!seller) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    seller.name = name || seller.name;
    seller.description = description || seller.description;
    seller.address = address || seller.address;
    seller.phoneNumber = phoneNumber || seller.phoneNumber;
    seller.zipCode = zipCode || seller.zipCode;

    await seller.save();
    await Product.updateMany(
      { shopId: seller._id.toString() },
      { $set: { shop: seller } },
    );
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("file"),
  updateShopAvatar,
);
router.put("/update-seller-info", isSeller, updateShopInfo);


// get all sellers ---- admin only
const getAllSellers = catchAsyncErrors(async (req, res, next) => {
  try {
    const sellers = await Shop.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// DELETE SELLER (ADMIN ONLY)
const deleteSeller = catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.params.id);
    if (!seller) {
      return next(new ErrorHandler("Seller not found with this id", 404));
    }

    // Delete seller avatar from local storage
    if (seller.avatar?.public_id) {
      await cloudinary.uploader.destroy(seller.avatar.public_id);
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Seller deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// UPDATE PAYMENT METHODS (SELLER ONLY)
const updatePaymentMethods = catchAsyncErrors(async (req, res, next) => {
  try {
    const { withdrawMethod } = req.body;

    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    seller.withdrawMethod = withdrawMethod;
    await seller.save();

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// DELETE WITHDRAW METHOD (SELLER ONLY)
const deleteWithdrawMethod = catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    seller.withdrawMethod = null;
    await seller.save();

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.put("/update-payment-methods", isSeller, updatePaymentMethods);
router.delete("/delete-withdraw-method", isSeller, deleteWithdrawMethod);

module.exports = router;
