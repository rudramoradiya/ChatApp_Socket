const Joi = require("joi");

const createGroupSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Group name is required",
  }),
  users: Joi.array().items(Joi.string().regex(/^[a-fA-F0-9]{24}$/)).min(1).required().messages({
    "array.min": "At least one user is required",
  }),
});

module.exports = { createGroupSchema };
