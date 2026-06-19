const Chat = require("../../models/chat");
const Message = require("../../models/message");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId)
      .populate("participants", "_id username email profileImage status")
      .populate("group");
    if (!chat) {
      return res.recordNotFound({ message: "Chat not found" });
    }
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.unAuthorized({ message: "You are not a participant of this chat" });
    }
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "_id username profileImage")
      .sort({ createdAt: 1 });
    return res.success({ message: "Chat fetched successfully", data: { chat, messages } });
  } catch (error) {
    return res.internalServerError({
      message: "Get single chat failed",
      data: { errors: error.message },
    });
  }
}; 