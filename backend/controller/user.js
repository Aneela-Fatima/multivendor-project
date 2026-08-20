const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

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
        } else {
          res.json({ message: "File deleted Successfully" });
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

    try{
      await sendMail({
        email:user.email,
        subject:"Activate Your Account",
        message:`Hello ${user.name}, Please click on the link to activate your account: ${activationUrl}`
      })
      res.status(201).json({
        succes:true,
        message:`Plaease check your email:- ${user.email} to activate your account`
      })

    }catch(error){
      return next (new ErrorHandler(err.message,500))
    }

  } catch (error) {
    return next(new ErrorHandler(error.message,400));
  }
});

// create activation token
const createActivationToken = (user)=>{
  return jwt.sign(user,process.env.ACTIVATION_SECRET,{
    expiresIn:"5m"
  })
}
// activate user

module.exports = router;
