const Joi = require("joi");

exports.updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have at least {#limit} characters",
    "string.max": "Username should have at most {#limit} characters",
  }),
  email: Joi.string().email().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be empty",
    "string.email": "Please enter a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.base": "Phone number should be a type of text",
      "string.empty": "Phone number cannot be empty",
      "string.pattern.base": "Phone number must be 10 digits",
    }),
  profileImage: Joi.string()
    .messages({
      "string.base": "Profile image must be a string",
    })
    .optional(),

  about: Joi.string()
    .max(250)
    .allow("")
    .messages({
      "string.base": "About should be a type of text",
      "string.max": "About section should not exceed {#limit} characters",
    })
    .optional(),
});
