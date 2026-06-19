const Group = require("../../models/group");
const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.recordNotFound({ message: "Group not found" });
    }

    // Only admin can update group
    if (group.admin.toString() !== userId) {
      return res.unAuthorized({ message: "Only admin can edit the group" });
    }

    // Handle updates from form-data
    const { name } = req.body;

    if (name) group.name = name;

    // If image file was uploaded
    if (req.file) {
      group.groupImage = `/uploads/groups/${req.file.filename}`;
    }

    await group.save();

    // populate members if needed in response
    const populatedGroup = await Group.findById(group._id).populate({
      path: "members",
      select: "-password",
    });

    return res.success({
      message: "Group updated successfully",
      data: populatedGroup,
    });
  } catch (error) {
    console.error("Update Group Error:", error);
    return res.internalServerError({
      message: "Edit group failed",
      data: { errors: error.message },
    });
  }
};
