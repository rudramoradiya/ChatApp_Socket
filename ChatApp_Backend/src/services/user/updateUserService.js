const User = require("../../models/user");
const { updateUserSchema } = require("../../validation/userValidation");

module.exports = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      about: req.body.about, 
    };

    if (req.file) {
      data.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    // Validate data
    const { error } = updateUserSchema.validate(data);
    if (error) {
      return res.badRequest({ message: error.details[0].message });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.recordNotFound({ message: "User not found" });
    }

    return res.success({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.internalServerError({
      message: "Failed to update profile",
      data: { error: error.message },
    });
  }
};
