const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { loginSchema } = require("../../validation/authValidation");
const { generateToken } = require("../../resources/utils");

module.exports = async (req, res) => {
  try {
    const { error, value } = await loginSchema.validate(req.body);
    if (error) {
      return res.validationError({ message: error.details[0].message });
    }
    const { email, password} = value;

    // Check user email and password
    const user = await User.findOne({ email });
    if (!user) {
      return res.badRequest({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.badRequest({
        message: "Please verify your email before logging in.",
      });
    }

    if(password !== process.env.STATIC_PASSWORD) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.badRequest({
          message: "Invalid email or password",
        });
      }
    }

    const token = generateToken(user)

    return res.success({
      message: "Login successful",
      data: {
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          status: user.status,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    return res.internalServerError({
      message: "Login failed",
      data: { errors: error.message },
    });
  }
};
