const Chat = require("../../models/chat");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.recordNotFound({ message: "Chat not found" });
    }
    if (!chat.participants.map(p => p.toString()).includes(userId)) {
      return res.unAuthorized({ message: "You are not a participant of this chat" });
    }
    await Chat.deleteOne({ _id: chatId });
    return res.success({ message: "Chat deleted successfully" });
  } catch (error) {
    return res.internalServerError({
      message: "Delete chat failed",
      data: { errors: error.message },
    });
  }
}; 