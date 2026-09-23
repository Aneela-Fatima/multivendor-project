const express = require("express");
const Messages = require("../model/messages");
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticatedOrSeller } = require("../middleware/auth");
const router = express.Router();

//  CREATE NEW MESSAGE (with optional image upload)
const createMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { conversationId, text, sender } = req.body;

    if (req.authId !== sender) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.members.includes(req.authId)) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const message = new Messages({
      conversationId,
      text,
      sender,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


//  GET ALL MESSAGES FOR A CONVERSATION
const getMessages = catchAsyncErrors(async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.members.includes(req.authId)) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const messages = await Messages.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.post(
  "/create-new-message",
  isAuthenticatedOrSeller,
  createMessage,
);
router.get(
  "/get-all-messages/:id",
  isAuthenticatedOrSeller,
  getMessages,
);

module.exports = router;