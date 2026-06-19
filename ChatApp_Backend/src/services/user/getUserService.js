const User = require("../../models/user");
const { generateToken } = require("../../resources/utils");

module.exports = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.recordNotFound({ message: "User not found" });
    }

    const token = generateToken(user)

    return res.success({
      message: "Get user data successfully",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          status: user.status,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
      },
    });
  } catch (error) {
    return res.internalServerError({
      message: "User verification failed",
      data: { errors: error.message },
    });
  }
};
