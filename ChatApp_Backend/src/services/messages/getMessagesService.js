const Message = require("../../models/message");
const Chat = require("../../models/chat");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.recordNotFound({ message: "Chat not found" });
    }
    if (!chat.participants.map(id => id.toString()).includes(userId)) {
      return res.unAuthorized({ message: "You are not a participant of this chat" });
    }
    // Pagination parameters
    const limit = parseInt(req.query.limit) || 20;
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await Message.find({
      chat: chatId,
      createdAt: { $lt: before },
    })
      .populate("sender", "_id username profileImage")
      .sort({ createdAt: -1 }) // newest first
      .limit(limit);

    // Return in chronological order
    return res.success({
      message: "Messages fetched successfully",
      data: messages.reverse(),
    });
  } catch (error) {
    return res.internalServerError({
      message: "Get messages failed",
      data: { errors: error.message },
    });
  }
}; 