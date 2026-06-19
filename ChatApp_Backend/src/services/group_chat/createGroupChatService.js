const User = require("../../models/user");
const Group = require("../../models/group");
const Chat = require("../../models/chat");
const { createGroupSchema } = require("../../validation/groupValidation");

module.exports = async (req, res) => {
  try {
    const adminId = req.user.id;
    let { users, name } = req.body;

    // Parse users if sent as string in form-data
    if (typeof users === "string") {
      users = JSON.parse(users);
    }

    const { error } = createGroupSchema.validate({ name, users });
    if (error) {
      return res.badRequest({ message: error.details[0].message });
    }

    const allUserIds = [...new Set([...users, adminId])];
    const foundUsers = await User.find({ _id: { $in: allUserIds } });
    if (foundUsers.length !== allUserIds.length) {
      return res.badRequest({ message: "Some users not found" });
    }

    let groupImage = "";
    if (req.file) {
      groupImage = `/uploads/groups/${req.file.filename}`;
    }

    const group = await Group.create({
      name,
      admin: adminId,
      createdBy: adminId,
      members: allUserIds,
      groupImage,
    });

    let chat = await Chat.create({
      roomId: `group_${group._id}`,
      participants: allUserIds,
      isGroupChat: true,
      group: group._id,
    });

    // ✅ Populate group.members and chat.participants
    chat = await Chat.findById(chat._id)
      .populate({
        path: "group",
        populate: { path: "members", select: "-password" },
      })
      .populate({
        path: "participants",
        select: "-password",
      });

    return res.success({
      message: "Group chat created successfully",
      data: chat,
    });
  } catch (err) {
    console.error("Create Group Error:", err);
    return res.internalServerError({
      message: "Create group chat failed",
      data: { error: err.message },
    });
  }
};
