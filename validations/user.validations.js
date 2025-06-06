const Joi = require('joi');
const loginValidation = Joi.object({
    password: Joi.string().min(6).required().error(new Error("Password should contain atlease 6 characters")),
    email: Joi.string().email().required().error(new Error("Please enter valid email"))
});


const validateCreateUser = Joi.object({
    role_id: Joi.string().required().error(new Error("Please select role")),
    first_name: Joi.string().required().error(new Error("Please enter your first name")),
    last_name: Joi.string().required().error(new Error("Please enter your last name")),
    email: Joi.string().email().required().error(new Error("Please enter valid email")),
    password: Joi.string().min(6).required().error(new Error("Password should contain atlease 6 characters")),
    gender: Joi.string().valid("Male", "Female", "Both", "Not Selected").required().error(new Error("Please select your gender")),
    is_active: Joi.number().valid(0, 1).required().error(new Error("Please provide a valid status (0 for Inactive, 1 for Active)"))
})

const validateUpdateUser = Joi.object({
    role_id: Joi.string().optional().error(new Error("Please select role")),
    first_name: Joi.string().required().error(new Error("Please enter your first name")),
    last_name: Joi.string().required().error(new Error("Please enter your last name")),
    email: Joi.string().email().optional().error(new Error("Please enter valid email")),
    password: Joi.string().min(6).optional().error(new Error("Password should contain at least 6 characters")),
    gender: Joi.string()
        .valid("Male", "Female", "Both", "Not Selected")
        .optional()
        .error(new Error("Please select your gender"))
})


const bulkUpdateSchema = Joi.object({
  filter: Joi.object().default({}),
  update: Joi.object().min(1).required().error(new Error("At least one field to update is required"))
});



module.exports = {
    loginValidation,
    validateCreateUser,
    validateUpdateUser,
    bulkUpdateSchema
};
