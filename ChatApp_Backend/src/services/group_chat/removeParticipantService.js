const Group = require("../../models/group");
const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.id;
    const { userId: removeId } = req.body;
    if (!removeId) {
      return res.badRequest({ message: "userId to remove is required" });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.recordNotFound({ message: "Group not found" });
    }
    if (group.admin.toString() !== userId) {
      return res.unAuthorized({ message: "Only admin can remove participants" });
    }
    // Remove user
    group.members = group.members.filter(id => id.toString() !== removeId);
    await group.save();

      // ✅ Populate member details
    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'username email avatar status') 
      .populate('admin', 'username email');


    return res.success({ message: "Participant removed successfully", data: updatedGroup });
  } catch (error) {
    return res.internalServerError({
      message: "Remove participant failed",
      data: { errors: error.message },
    });
  }
}; 