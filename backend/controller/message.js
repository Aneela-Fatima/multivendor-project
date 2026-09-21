import Messages from "../model/message.js";
import Conversation from "../model/conversation.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js"; // ⬅️ Add this import at top
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

//  CREATE NEW MESSAGE (with optional image upload)
export const createMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { conversationId, text, sender } = req.body;

    if (req.authId !== sender) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.members.includes(req.authId)) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, "sahiwal-electronics/chat"),
      );
      const results = await Promise.all(uploadPromises);
      images = results.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
      }));
    }

    const message = new Messages({
      conversationId,
      text,
      sender,
      images: images.length > 0 ? images : undefined,
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
export const getMessages = catchAsyncErrors(async (req, res, next) => {
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