const Joi = require('joi');
const validateCreateRole = Joi.object({
    name: Joi.string().required().error(new Error("Please enter your name")),
    access_module: Joi.array().items(Joi.string().min(1).max(50)).required().error(new Error("Please provide access modules")),
    is_active: Joi.number().valid(0, 1).required().error(new Error("Please provide a valid status (0 for Inactive, 1 for Active)"))
}).unknown(false); // Allow additional properties


const validateUpdateRole = Joi.object({
    name: Joi.string().optional().error(new Error("Please enter your name")),
    access_module: Joi.array().items(Joi.string().min(1).max(50)).optional().error(new Error("Please provide access modules")),
    is_active: Joi.number().valid(0, 1).optional().error(new Error("Please provide a valid status (0 for Inactive, 1 for Active)"))
}).unknown(false); // Allow additional properties
module.exports = {
    validateCreateRole,
    validateUpdateRole
};