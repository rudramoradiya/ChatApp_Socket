const User = require("../models/user");
const Notification = require("../models/notification");
const sendNotification = require("../resources/notificationUtils");
const SOCKET = require("../constants/socketEvents");
const Chat = require("../models/chat");
const Message = require("../models/message");

const onlineUsers = new Map();

module.exports = (io) => {
  io.on(SOCKET.CONNECT, (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // User comes online
    socket.on("userOnline", async ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, {
        status: "online",
        socketId: socket.id,
      });
      io.emit("updateUserStatus", { userId, status: "online" });
      console.log(`🟢 User ${userId} is online (socket: ${socket.id})`);

      // Send missed notifications
      const notifications = await Notification.find({
        user: userId,
        isRead: false,
      });
      notifications.forEach((n) => {
        socket.emit("notification", n);
      });
      if (notifications.length > 0) {
        console.log(
          `📤 Delivered ${notifications.length} missed notifications to user ${userId}`
        );
      }
    });

    // Join a chat room
    socket.on(SOCKET.JOIN_ROOM, ({ roomId }) => {
      socket.join(roomId);
      console.log(`➡️  Socket ${socket.id} joined room ${roomId}`);
    });

    // Send a message (broadcast to room)
    socket.on(SOCKET.SEND_MESSAGE, async ({ roomId, message, recipientId }) => {
      // Save the message to the database
      try {
        const chat = await Chat.findById(message.chat);
        if (!chat) return;
        const savedMessage = await Message.create({
          sender: message.sender,
          chat: message.chat,
          content: message.content,
          messageType: message.messageType || "text",
          group: chat.group || undefined,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          isRead: false,
        });
        chat.lastMessage = savedMessage._id;
        await chat.save();
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate("sender", "_id username profileImage")
          .populate("chat");
        io.to(roomId).emit(SOCKET.RECEIVE_MESSAGE, populatedMessage);
        console.log(`✉️  Message sent to room ${roomId}:`, populatedMessage);

        // Send notification to recipient (if not sender)
        if (recipientId && recipientId !== message.sender) {
          await sendNotification(io, recipientId, {
            type: "message",
            data: {
              chatId: savedMessage.chat,
              messageId: savedMessage._id,
              content: savedMessage.content,
            },
          });
        }
      } catch (err) {
        console.error("Socket message save error:", err);
      }
    });

    // Typing indicator (optional)
    socket.on(SOCKET.TYPING, ({ roomId, userId }) => {
      socket.to(roomId).emit(SOCKET.TYPING, { userId });
      console.log(`⌨️  User ${userId} is typing in room ${roomId}`);
    });

    socket.on(SOCKET.STOP_TYPING, ({ roomId, userId }) => {
      socket.to(roomId).emit(SOCKET.STOP_TYPING, { userId });
      console.log(`🛑 User ${userId} stopped typing in room ${roomId}`);
    });

    // User disconnects
    socket.on(SOCKET.DISCONNECT, async () => {
      const userId = [...onlineUsers.entries()].find(
        ([_, id]) => id === socket.id
      )?.[0];
      if (userId) {
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, {
          status: "offline",
          socketId: "",
        });
        io.emit("updateUserStatus", { userId, status: "offline" });
        console.log(`🔴 User ${userId} went offline (socket: ${socket.id})`);
      }
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};
