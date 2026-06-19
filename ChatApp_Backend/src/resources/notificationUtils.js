const User = require("../models/user");
const Notification = require("../models/notification");

module.exports = async function sendNotification(
  io,
  userId,
  notificationData,
  isSaved = false
) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`⚠️ User ${userId} not found while sending notification`);
      return;
    }

    // Either use passed saved document, or create one
    const notification = isSaved
      ? notificationData
      : await Notification.create({
          user: userId,
          type: notificationData.type,
          data: notificationData.data,
          isRead: false,
        });

    if (user.status === "online" && user.socketId) {
      io.to(user.socketId).emit("notification", notification);
      console.log(`🔔 Real-time notification sent to user ${userId}`);
    } else {
      console.log(`💾 Notification saved for offline user ${userId}`);
    }
  } catch (err) {
    console.error(`❌ Error sending notification to user ${userId}:`, err);
  }
};
