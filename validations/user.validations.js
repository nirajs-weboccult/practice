const Joi = require('joi');
const loginValidation = Joi.object({
    password: Joi.string().min(6).required().error(new Error("Password should contain atlease 6 characters")),
    email: Joi.string().email().required().error(new Error("Please enter valid email")),
    user_type: Joi.number().required().error(new Error("Please provide user role")),
});

const AddUser = Joi.object({
    name: Joi.string().required().error(new Error("Please enter your name")),
    mobile_number: Joi.string().min(8).required().error(new Error("Please enter your mobile number")),
    email: Joi.string().email().required().error(new Error("Please enter valid email")),
    address: Joi.string().required().error(new Error("Please enter your address")),
    gender: Joi.string().required().error(new Error("Please select your gender")),
    pronouns: Joi.string().required().error(new Error("Please select your pronouns")),
    dob: Joi.string().required().error(new Error("Please select your date of birth")),
    password: Joi.string().min(6).required().error(new Error("Password should contain atlease 6 characters")),
    role: Joi.number().required().error(new Error("Please select role")),
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



module.exports = {
    loginValidation,
    AddUser,
    validateCreateUser,
    validateUpdateUser
};
