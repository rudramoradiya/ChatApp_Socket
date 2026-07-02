const DEFAULT_FROM = process.env.EMAIL_USER;

const EMAIL_SUBJECT = {
  VERIFICATION_EMAIL: "Verification Email From Storage Rental App",
};

const EMAIL_TEMPLATES = {
  VERIFICATION_EMAIL: "otpVerificationTemplate.ejs",
};

module.exports = {
  DEFAULT_FROM,
  EMAIL_SUBJECT,
  EMAIL_TEMPLATES,
};
