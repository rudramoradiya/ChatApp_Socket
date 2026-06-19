const Chat = require("../../models/chat");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "_id username email profileImage status")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "_id username profileImage" } })
      .populate("group")
      .sort({ updatedAt: -1 });
    return res.success({ message: "Chats fetched successfully", data: chats });
  } catch (error) {
    return res.internalServerError({
      message: "Get all chats failed",
      data: { errors: error.message },
    });
  }
}; 