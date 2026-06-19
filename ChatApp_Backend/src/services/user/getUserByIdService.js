const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.badRequest({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.recordNotFound({ message: "User not found" });
    }

    return res.success({
      message: "User profile retrieved successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Get User by ID Error:", error);
    return res.internalServerError({
      message: "Failed to get user profile",
      data: { error: error.message },
    });
  }
}; 