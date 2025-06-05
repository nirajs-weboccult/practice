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

            // Fetch users and total count
            const [users, totalUsersData] = await Promise.all([
                this.userService.getUsers(search, limit, offset, sort, order),
                this.userService.countUsers(search)
            ]);
            console.log(totalUsersData);
            
            const totalUsers = totalUsersData.total || 0;
            const totalPages = Math.ceil(totalUsers / limit);

            // Send paginated response
            return res.status(200).json({
                status: true,
                users,
                totalUsers,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createUser(req, res) {
        try {
            const { name, email, password, role_id , gender , is_active  } = req.body;
            const {error} = this.validation.validateCreateUser.validate(req.body);
            if (error) {
                console.log(error);
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }
            
            
            const newUser = await this.userService.insertUser({ name, email, password, role_id , gender , is_active });
            console.log("newUser", newUser);
            if (newUser.status === false) {
                return res.status(400).json({ status: false, message: newUser.message});
            }
            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req,res){
        try {
            const userId = req.params.id;
            const updateData = req.body;
            // Check if user exists
            const {error} = this.validation.validateUpdateUser.validate(req.body);
            if (error) {
                console.log(error);
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }
            const existingUser = await this.userService.findUserById(userId)
            if(!existingUser){
                return res.status(400).json({
                    status: false,
                    message: this.messages.USER_NOT_FOUND
                });
            }
            const updatedUser = await this.userService.updateUserById(userId,updateData)
            if(updatedUser.status===false){
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

    async deleteUser(req,res){
        try{
            const userId = req.params.id;

            const existingUser = await this.userService.findUserById(userId)
            console.log(existingUser);
            
            if(!existingUser){
                return res.status(400).json({
                    status: false,
                    message: this.messages.USER_NOT_FOUND
                });
            }

            const deleteUser = await this.userService.deleteUserById(userId)
            if(deleteUser.status===false){
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.USER_DELETE_SUCCESSFULLY
            });
        }catch(error){
            console.error("Delete User error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR 
            });
        }
    }

    async userStatusChange(req,res){
        try{
            const userId = req.params.id;
            const status = Number(req.body.is_active);
            // Check if user exists
            
            if(!status&&status!=0&&status!=1&&status!=NaN){
                return res.status(400).json({
                    status: false,
                    message: "Please enter valid details"
                });
            }

            const existingUser = await this.userService.findUserById(userId)
            if(!existingUser){
                return res.status(400).json({
                    status: false,
                    message: this.messages.USER_NOT_FOUND
                });
            }
            const statusObj = {
                is_active:status
            }
            const updatedUser = await this.userService.updateUserById(userId,statusObj)
            if(updatedUser.status===false){
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.USER_UPDATED_SUCCESSFULLY
            });
        }catch(error){
             console.error("Change Status:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR 
            });
        }
    }


    async updateMultipleUsers(req, res) {
        try {
            const { filter = {}, update = {} } = req.body;

            if (!update || Object.keys(update).length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Update data is required"
                });
            }

            const result = await this.userModel.updateMany(filter, { $set: update });

            return res.status(200).json({
                status: true,
                message: `${result.modifiedCount} user(s) updated successfully`,
                result
            });

        } catch (error) {
            console.error("Bulk update error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

//     const bulkUpdateSchema = Joi.object({
//   filter: Joi.object().default({}),
//   update: Joi.object().min(1).required().error(new Error("At least one field to update is required"))
// });

// {
//   "filter": { "role_id": "665e..." },
//   "update": { "lastname": "ABC" }
// }


    async updateManyUsersWithDifferentData(req, res) {
        try {
            const updates = req.body.updates;

            if (!Array.isArray(updates) || updates.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Updates should be a non-empty array"
                });
            }

            const bulkOps = updates.map(user => {
                return {
                    updateOne: {
                        filter: { _id: user.id },
                        update: { $set: user.data }
                    }
                };
            });

            const result = await this.userModel.bulkWrite(bulkOps);

            return res.status(200).json({
                status: true,
                message: `${result.modifiedCount} user(s) updated successfully`,
                result
            });

        } catch (error) {
            console.error("Bulk different update error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

//     {
//   "updates": [
//     {
//       "id": "665e1f029ab3fd23cc54e7c1",
//       "data": {
//         "firstName": "John"
//       }
//     },
//     {
//       "id": "665e1f029ab3fd23cc54e7c2",
//       "data": {
//         "email": "new.email@example.com",
//         "access_modules": ["dashboard", "users"]
//       }
//     }
//   ]
// }

// const bulkUpdateDifferentSchema = Joi.object({
//   updates: Joi.array().items(
//     Joi.object({
//       id: Joi.string().required(),
//       data: Joi.object().min(1).required()
//     })
//   ).min(1).required()
// });


}

module.exports = new UserController();