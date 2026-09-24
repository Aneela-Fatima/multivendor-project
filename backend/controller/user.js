const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");
const { json } = require("stream/consumers");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
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

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate Your Account",
        message: `Hello ${user.name}, Please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        succes: true,
        message: `Plaease check your email:- ${user.email} to activate your account`,
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
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );
      if (!newUser)
        return next(new ErrorHandler("Invalid or expired token", 400));

      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      uaer = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: avatar,
          url: `${req.protocol}://${req.get("host")}/${avatar}`,
        },
      });

      sendToken(newUser, 201, res);
      res.status(201).json({ success: true });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
      }
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide correct information!", 400),
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// Logout User
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      re.cookie("token", null, {
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

// update use info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      if (password && password.trim() !== "") {
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          return next(
            new ErrorHandler("Please provide correct information", 400),
          );
        }
      }

      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          return next(new ErrorHandler("Email already exists", 400));
        }
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber ?? user.phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existUser = await User.findById(req.user.id);

      if (existUser?.avatar) {
        const oldAvatar =
          typeof existUser.avatar === "string"
            ? existUser.avatar
            : existUser.avatar.url;

        if (oldAvatar) {
          const cleanOldAvatar = oldAvatar.replace(/^https?:\/\/[^/]+\//, "");
          const oldAvatarPath = path.join(
            "uploads",
            path.basename(cleanOldAvatar),
          );

          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
      }

      const fileName = req.file.filename;
      const avatarUrl = `${req.protocol}://${req.get("host")}/${fileName}`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          avatar: {
            public_id: fileName,
            url: avatarUrl,
          },
        },
        { new: true },
      );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { country, city, address1, address2, zipCode, addressType, _id } =
      req.body;

    if (!country || !city || !address1 || !address2 || !addressType) {
      return next(new ErrorHandler("Please provide all address fields", 400));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    const addressPayload = {
      country,
      city,
      address1,
      address2,
      zipCode: zipCode ? Number(zipCode) : undefined,
      addressType,
    };

    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === addressType,
    );
    if (
      sameTypeAddress &&
      (!addressPayload._id || sameTypeAddress._id.toString() !== _id)
    ) {
      return next(
        new ErrorHandler(`${addressType} address already exist`, 400),
      );
    }

    const existingAddress = user.addresses.find(
      (address) => address._id && address._id.toString() === _id,
    );

    if (existingAddress) {
      Object.assign(existingAddress, addressPayload);
    } else {
      user.addresses.push(addressPayload);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  }),
);

// delete user address
router.delete(
  "/delete-user-address/:id",

  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } },
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword,
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400),
        );
      }

      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET ALL USERS (ADMIN ONLY)
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


// DELETE USER (ADMIN ONLY)
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found with this id", 404));
    }

    // Delete user's local avatar file from the uploads/ folder
    if (user.avatar?.public_id) {
      const avatarPath = `uploads/${user.avatar.public_id}`;
      fs.access(avatarPath, fs.constants.F_OK, (err) => {
        if (!err) fs.unlink(avatarPath, () => {});
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/admin-all-users", isAuthenticated, isAdmin("Admin"), getAllUsers);
router.delete("/delete-user/:id", isAuthenticated, isAdmin("Admin"), deleteUser);

module.exports = router;
