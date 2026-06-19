const Message = require("../../models/message");
const Chat = require("../../models/chat");

module.exports = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { chatId, content, messageType } = req.body;
    if (!chatId || !content) {
      return res.badRequest({ message: "chatId and content are required" });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.recordNotFound({ message: "Chat not found" });
    }
    if (!chat.participants.map(id => id.toString()).includes(senderId)) {
      return res.unAuthorized({ message: "You are not a participant of this chat" });
    }
    const message = await Message.create({
      sender: senderId,
      chat: chatId,
      content,
      messageType: messageType || "text",
      group: chat.group || undefined,
    });
    chat.lastMessage = message._id;
    await chat.save();
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "_id username profileImage")
      .populate("chat");
    return res.success({ message: "Message sent successfully", data: populatedMessage });
  } catch (error) {
    return res.internalServerError({
      message: "Send message failed",
      data: { errors: error.message },
    });
  }
}; 