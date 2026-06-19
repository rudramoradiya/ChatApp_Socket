const Message = require("../../models/message");
const Chat = require("../../models/chat");
const Group = require("../../models/group");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.recordNotFound({ message: "Message not found" });
    }
    const chat = await Chat.findById(message.chat);
    if (!chat) {
      return res.recordNotFound({ message: "Chat not found" });
    }
    let isAllowed = false;
    if (chat.isGroupChat) {
      const group = await Group.findById(chat.group);
      if (group && group.members.map(id => id.toString()).includes(userId)) {
        isAllowed = true;
      }
    } else {
      if (message.receiver && message.receiver.toString() === userId) {
        isAllowed = true;
      }
      if (message.sender && message.sender.toString() === userId) {
        isAllowed = true;
      }
    }
    if (!isAllowed) {
      return res.unAuthorized({ message: "You are not allowed to mark this message as read" });
    }
    message.isRead = true;
    await message.save();
    return res.success({ message: "Message marked as read", data: message });
  } catch (error) {
    return res.internalServerError({
      message: "Mark message as read failed",
      data: { errors: error.message },
    });
  }
}; 