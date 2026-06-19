const Group = require("../../models/group");

module.exports = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    console.log("Requested groupId:", groupId);

    if (!groupId) {
      return res.badRequest({ message: "Group ID is required" });
    }

    const group = await Group.findById(groupId)
      .populate("members", "username email profileImage status")
      .populate("admin", "username email profileImage");

    if (!group) {
      return res.recordNotFound({ message: "Group not found" });
    }

    // Check if user is a member of the group
    const isMember = group.members.some(
      (member) => member._id.toString() === userId
    );
    const isAdmin = group.admin._id.toString() === userId;

    if (!isMember && !isAdmin) {
      return res.unAuthorized({
        message: "You are not a member of this group",
      });
    }

    return res.success({
      message: "Group profile retrieved successfully",
      data: {
        group,
        userRole: isAdmin ? "admin" : "member",
      },
    });
  } catch (error) {
    console.error("Get Group by ID Error:", error);
    return res.internalServerError({
      message: "Failed to get group profile",
      data: { error: error.message },
    });
  }
};
