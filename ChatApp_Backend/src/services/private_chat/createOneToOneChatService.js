const Chat = require("../../models/chat");
const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.badRequest({ message: "receiverId is required" });
    }
    if (receiverId === senderId) {
      return res.badRequest({ message: "Cannot create chat with yourself" });
    }
    // Check if both users exist
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.recordNotFound({ message: "Receiver not found" });
    }
    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [senderId, receiverId], $size: 2 },
    });
    if (!chat) {
      // Fix: Use lexicographical comparison for roomId
      const [id1, id2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];
      chat = await Chat.create({
        roomId: `${id1}_${id2}`,
        participants: [senderId, receiverId],
        isGroupChat: false,
      });
    }
    chat = await Chat.findById(chat._id).populate("participants", "_id username email profileImage status");
    return res.success({ message: "Chat created successfully", data: chat });
  } catch (error) {
    return res.internalServerError({
      message: "Create 1:1 chat failed",
      data: { errors: error.message },
    });
  }
}; 