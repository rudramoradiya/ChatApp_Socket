const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const otp = require("../../models/otp");
const { generateOtp } = require("../../resources/utils");
const { sendOtpEmail } = require("../../resources/emailUtils");
const { registerSchema } = require("../../validation/authValidation");

module.exports = async (req, res) => {
  try {
    const { error, value } = await registerSchema.validate(req.body);
    if (error) {
      return res.validationError({ message: error.details[0].message });
    }

    const { username, email, phone, password } = value;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.badRequest({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    const { otpCode, otpExpiry } = generateOtp();

    await otp.create({
      email,
      otp: otpCode,
      expiresAt: otpExpiry,
    });

    let responseData = {
      message: "Register Successful! OTP sent to your email",
      data: {},
    };

    try {
      await sendOtpEmail(email, otpCode, username);
    } catch (emailError) {
      console.error("OTP email failed during registration:", emailError);
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
      message: "Registration failed",
      data: { errors: error.message },
    });
  }
};
