const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const router = express.Router();

// create a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      const isConversationExist = await Conversation.findOne({ groupTitle });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
            success: true,
            conversation,
        })
      }else{
        const conversation = await Coversation.create({
        members: [userId,sellerId],
        groupTitle: groupTitle
      });
    res.status(201).json({
      success: true,
      conversation,
    });
      }

      
  } catch (error) {
    return next(new ErrorHandler(error.response.message, 500));
  }
}));

// get seller conversation
export const getSellerConversations = catchAsyncErrors(async (req, res, next) => {
  try {
    // Sellers can only ever fetch their own conversation list
    if (req.params.id !== req.seller._id.toString()) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get userconversation
export const getUserConversations = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update last message
export const updateLastMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return next(new ErrorHandler("Conversation not found", 404));
    }

    // Whoever is calling this must actually be a member of the conversation
    if (!conversation.members.includes(req.authId)) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    conversation.lastMessage = lastMessage;
    conversation.lastMessageId = lastMessageId;
    await conversation.save();

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


module.exports = router;
