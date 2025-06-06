const baseController = require('./base.controller');

class UserController extends baseController {
    constructor() {
        super();
        this.userService = require('../services/user.service');
        this.validation = require('../validations/user.validations');
        this.es6BindAll(this, []);
    }


    async listUsers(req, res) {
        try {
            const search = req.query.search?.trim() || '';
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 10);
            const offset = (page - 1) * limit;
            const sort = req.query.sort || 'createdAt';
            const order = req.query.order === 'asc' ? 'asc' : 'desc'; // default to 'desc' if invalid

            const [users, totalUsersData] = await Promise.all([
                this.userService.getUsers(search, limit, offset, sort, order),
                this.userService.countUsers(search)
            ]);

            const totalUsers = totalUsersData.total || 0;
            const totalPages = Math.ceil(totalUsers / limit);

            return res.status(200).json({
                status: true,
                users,
                totalUsers,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: this.messages.INTERNAL_SERVER_ERROR });
        }
    }

    async createUser(req, res) {
        try {
            const { email, password, role_id, gender, is_active, first_name, last_name } = req.body;
            const { error } = this.validation.validateCreateUser.validate(req.body);
            if (error) {
                console.log(error);
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }


            const newUser = await this.userService.insertUser({ email, password, role_id, gender, is_active, first_name, last_name });
            if (newUser.status === false) {
                return res.status(400).json({ status: false, message: newUser.message });
            }
            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: this.messages.INTERNAL_SERVER_ERROR});
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            // Check if user exists
            const { error } = this.validation.validateUpdateUser.validate(req.body);
            if (error) {
                console.log(error);
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }
            const existingUser = await this.userService.findUserById(userId)
            if (!existingUser) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.USER_NOT_FOUND
                });
            }
            const updatedUser = await this.userService.updateUserById(userId, updateData)
            if (updatedUser.status === false) {
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.USER_UPDATED_SUCCESSFULLY
            });
        } catch (error) {
            console.error("Update user error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            const existingUser = await this.userService.findUserById(userId)
            if (!existingUser) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.USER_NOT_FOUND
                });
            }

            const deleteUser = await this.userService.deleteUserById(userId)
            if (deleteUser.status === false) {
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.USER_DELETE_SUCCESSFULLY
            });
        } catch (error) {
            console.error("Delete User error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            });
        }
    }

    async userStatusChange(req, res) {
        try {
            const userId = req.params.id;
            const status = Number(req.body.is_active);
            if (!status && status != 0 && status != 1 && status != NaN) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.ENTER_VALID_DETAILS
                });
            }

            const statusObj = {
                is_active: status
            }
            const updatedUser = await this.userService.updateUserById(userId, statusObj)
            if (updatedUser.status === false) {
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.USER_UPDATED_SUCCESSFULLY
            });
        } catch (error) {
            console.error("Change Status:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            });
        }
    }

    async updateManyUsersWithDifferentData(req, res) {
        try {
            const updates = req.body.updates;

            if (!Array.isArray(updates) || updates.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Updates should be a non-empty array"
                });
            }
            const bulkOps = [];
            for (const user of updates) {
                const updateData = { ...user.data };
                if (updateData.email) {
                    const existingUser = await this.userService.findUserWithEmail(updateData.email);
                    if (existingUser.status == false) {
                        return res.json({
                            status: false,
                            message: this.messages.USER_ALREADY_EXISTS
                        })
                    }
                }
                if (updateData.role_id) {
                    updateData.role_id = this.mongoose.Types.ObjectId(updateData.role_id);
                }

                bulkOps.push({
                    updateOne: {
                        filter: { _id: user.id },
                        update: { $set: updateData }
                    }
                });
            }

            let updatedData = await this.userService.userBulkWrite(bulkOps)
            return res.status(200).json({
                status: true,
                message: `${updatedData.modifiedCount} user(s) updated successfully`
            });

        } catch (error) {
            console.error("Bulk different update error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

    async updateMultipleUsers(req, res) {
        try {
            const { filter = {}, update = {} } = req.body;

            const { error } = this.validation.bulkUpdateSchema.validate(req.body);
            if (error) {
                console.warn("Validation error:", error.details?.[0]?.message);
                return res.status(400).json({
                    status: false,
                    message: error.details?.[0]?.message || "Invalid input",
                    type: 'ValidationError',
                });
            }

            if (!update || Object.keys(update).length === 0) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.ENTER_VALID_DETAILS
                });
            }

            try {
                if (filter.role_id) {
                    filter.role_id = this.mongoose.Types.ObjectId(filter.role_id);
                }
                if (filter._id) {
                    filter._id = this.mongoose.Types.ObjectId(filter._id);
                }
            } catch (convertErr) {
                console.error("Invalid ObjectId in filter:", convertErr);
                return res.status(400).json({
                    status: false,
                    message: this.messages.INVALID_ID_FORMATE
                });
            }

            // Perform update
            const result = await this.userService.updateManyUserWithFilter(filter, update);

            return res.status(200).json({
                status: true,
                message: `${result.modifiedCount} user(s) updated successfully`
            });

        } catch (error) {
            console.error("Bulk update error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages?.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

    async checkModuleAccess(req,res){
        try {
            const { userId, moduleName } = req.params;

            if (!userId || !moduleName) {
                return res.status(400).json({
                    status: false,
                    message: "User ID and module name are required"
                });
            }            
            const user = await this.userService.getAccessModule(userId)           
            const hasAccess = user.includes(moduleName)
            return res.status(200).json({
                status: true,
                hasAccess,
                message: hasAccess
                    ? `User has access to module '${moduleName}'`
                    : `User does NOT have access to module '${moduleName}'`
            });

        } catch (error) {
            console.error("Error checking module access:", error);
            return res.status(500).json({
                status: false,
                message:this.messages.INTERNAL_SERVER_ERROR
            });
        }
    }


}

module.exports = new UserController();