const Group = require("../../models/group");
const Chat = require("../../models/chat");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.id;

    let group = await Group.findById(groupId);
    if (!group) {
      return res.recordNotFound({ message: "Group not found" });
    }

    if (group.admin.toString() === userId) {
      // Admin: delete group and chat
      await Chat.deleteOne({ group: groupId });
      await Group.deleteOne({ _id: groupId });
      return res.success({ message: "Group deleted successfully" });
    } else {
      // Member: leave group
      if (!group.members.map(id => id.toString()).includes(userId)) {
        return res.badRequest({ message: "You are not a member of this group" });
      }
      group.members = group.members.filter(id => id.toString() !== userId);
      await group.save();

      // Re-fetch group with populated members and admin
      group = await Group.findById(groupId)
        .populate("members", "username email avatar") 
        .populate("admin", "username email avatar");  

      return res.success({ message: "Left group successfully", data: group });
    }
  } catch (error) {
    return res.internalServerError({
      message: "Delete or leave group failed",
      data: { errors: error.message },
    });
  }
};
