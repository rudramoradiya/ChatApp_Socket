const User = require("../../models/user");
const Otp = require("../../models/otp"); // Add this import
const { generateOtp } = require("../../resources/utils");
const { sendOtpEmail } = require("../../resources/emailUtils");
const { forgotPasswordSchema } = require("../../validation/authValidation");

module.exports = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.validationError({ message: error.details[0].message });
    }

    const { email } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.recordNotFound({ message: "User not found" });
    }

    // Set isVerified to false when forgot password is initiated
    user.isVerified = false;
    await user.save();

    // Delete old OTPs (using consistent capitalization)
    await Otp.deleteMany({ email });

    // Generate new OTP
    const { otpCode, otpExpiry } = generateOtp();

    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: otpExpiry,
    });

    let responseData = { message: "OTP sent to your email" };

    try {
      await sendOtpEmail(email, otpCode, user.username);
    } catch (emailError) {
      console.error("OTP email failed:", emailError);
      if (process.env.NODE_ENV === "production") {
        throw emailError;
      }
      console.log(`DEV OTP for ${email}: ${otpCode}`);
      responseData.devOtp = otpCode;
    }

    if (process.env.NODE_ENV !== "production") {
      responseData.devOtp = responseData.devOtp || otpCode;
    }

    return res.success(responseData);
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.internalServerError({
      message: "Forgot password failed",
      data: { errors: error.message },
    });
  }
};
