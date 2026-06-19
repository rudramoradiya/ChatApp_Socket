const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Otp = require("../../models/otp");
const { verifyOtpSchema } = require("../../validation/authValidation");
const { generateToken } = require("../../resources/utils");

module.exports = async (req, res) => {
  try {
    const { error, value } = await verifyOtpSchema.validate(req.body);
    if (error) {
      return res.validationError({ message: error.details[0].message });
    }
    const { email, otp } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.recordNotFound({ message: "User not found" });
    }

    // Add these checks
    if (user.isVerified) {
      return res.badRequest({ message: "Email already verified." });
    }

    // Check OTP (support STATIC_OTP)
    let otpRecord;
    if (otp === process.env.STATIC_OTP) {
      otpRecord = {
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        _id: null,
      };
    } else {
      otpRecord = await Otp.findOne({
        email,
        otp,
      });
    }
    if (!otpRecord) {
      return res.badRequest({ message: "Invalid OTP" });
    }

    // Check expiry
    if (!otpRecord.expiresAt || new Date() > otpRecord.expiresAt) {
      if (otpRecord._id) {
        await Otp.deleteOne({ _id: otpRecord._id });
      }
      return res.badRequest({ message: "OTP has expired" });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = generateToken(user)

    return res.success({
      message: "OTP verified successfully",
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
      message: "OTP verification failed",
      data: { errors: error.message },
    });
  }
};
