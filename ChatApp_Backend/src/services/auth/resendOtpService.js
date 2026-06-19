const User = require('../../models/user');
const Otp = require('../../models/otp');
const { resendOtpSchema } = require('../../validation/authValidation');
const { generateOtp } = require('../../resources/utils');
const { sendOtpEmail } = require('../../resources/emailUtils');

module.exports = async (req, res) => {
  try {
    const { error, value } = await resendOtpSchema.validate(req.body);
    if (error) {
      return res.validationError({ message: error.details[0].message });
    }
    const { email } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.recordNotFound({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.badRequest({ message: "User already verified" });
    }

    // Delete old OTPs for this user
    await Otp.deleteMany({ email });

    // Generate new OTP
    const { otpCode, otpExpiry } = generateOtp();
    
        await Otp.create({
          email,
          otp: otpCode,
          expiresAt: otpExpiry,
        });
    
    let responseData = { message: "OTP resent successfully" };

    try {
      await sendOtpEmail(email, otpCode, user.username);
    } catch (emailError) {
      console.error("OTP email failed on resend:", emailError);
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
    return res.internalServerError({
      message: "Resend OTP failed",
      data: { errors: error.message },
    });
  }
};