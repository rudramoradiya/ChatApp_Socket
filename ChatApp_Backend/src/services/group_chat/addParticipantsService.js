const Group = require("../../models/group");
const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.id;
    const { users } = req.body;

    if (!Array.isArray(users) || users.length < 1) {
      return res.badRequest({ message: "At least one user is required to add" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.recordNotFound({ message: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.unAuthorized({ message: "Only admin can add participants" });
    }

    // Check if all user IDs exist
    const foundUsers = await User.find({ _id: { $in: users } });
    if (foundUsers.length !== users.length) {
      return res.badRequest({ message: "Some users not found" });
    }

    // Avoid duplicate members
    group.members = Array.from(new Set([...group.members.map(id => id.toString()), ...users]));
    await group.save();

    // ✅ Populate user details in `members`
    const populatedGroup = await Group.findById(groupId).populate("members", "username email profileImage");

    return res.success({
      message: "Participants added successfully",
      data: populatedGroup,
    });
  } catch (error) {
    return res.internalServerError({
      message: "Add participants failed",
      data: { errors: error.message },
    });
  }
};
