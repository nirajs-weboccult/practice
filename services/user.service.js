const bcrypt = require('bcrypt');
class UserService {
    constructor() {
        this.mongoose = require('mongoose');
        this.userModel = require('../models/users');
        this.messages = require('../helpers/messages').allMessages;
        this.helperResponse = require('../helpers/helper-response');
    }

    async getUsers(search, limit, offset, sort, order) {
        try {
            const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const safeSearch = escapeRegex(search);
            const query = {
                is_active: 1,
                ...(safeSearch && {
                    $or: [
                        { first_name: new RegExp(safeSearch, 'i') },
                        { last_name: new RegExp(safeSearch, 'i') },
                        { email: new RegExp(safeSearch, 'i') },
                        { gender: new RegExp(safeSearch, 'i') }
                    ]
                })
            };

            const users = await this.userModel
                .find(query)
                .populate({
                    path: 'role_id',       // assuming 'roles' is a field in userModel that references the Role model
                    select: 'name access_module' // only get these fields from Role model
                })
                .sort({ [sort]: order === 'asc' ? 1 : -1 })
                .skip(offset)
                .limit(limit);
            return users;
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            }

        }
    }

    async countUsers(search) {
        try {
            const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const safeSearch = escapeRegex(search);
            const query = {
                is_active: 1,
                ...(safeSearch && {
                    $or: [
                        { first_name: new RegExp(safeSearch, 'i') },
                        { last_name: new RegExp(safeSearch, 'i') },
                        { email: new RegExp(safeSearch, 'i') },
                        { gender: new RegExp(safeSearch, 'i') }
                    ]
                })
            };
            const totalUsers = await this.userModel.countDocuments(query);

            return {
                status: true,
                total: totalUsers
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            }
        }


    }

    async insertUser(userData) {
        try {
            const existingUser = await this.userModel.findOne({ email: userData.email });
            if (existingUser) {
                return {
                    status: false,
                    message: this.messages.USER_ALREADY_EXISTS
                };
            }
            const hashedPassword = bcrypt.hashSync(userData.password, 10);
            const newUser = new this.userModel({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                password: hashedPassword,
                role_id: this.mongoose.Types.ObjectId(userData.role_id),
                is_active: userData.is_active || 1, // Default to active
                gender: userData.gender
            });

            await newUser.save();
            return {
                status: true,
                message: this.messages.USER_CREATED_SUCCESSFULLY,
                user: newUser
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async findUserById(userId) {
        try {
            const userData = await this.userModel.findOne({ _id: this.mongoose.Types.ObjectId(userId), is_active: 1 })
            return userData
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async updateUserById(userId, userData) {
        try {
            userData["updatedAt"] = new Date()
            const updateUser = await this.userModel.findOneAndUpdate({ _id: this.mongoose.Types.ObjectId(userId) }, { $set: userData }, { new: true })
            return {
                status: true,
                data: updateUser
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async deleteUserById(userId) {
        try {
            const deleteUser = await this.userModel.findOneAndDelete({ _id: this.mongoose.Types.ObjectId(userId) })
            return {
                status: true,
                data: deleteUser
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async findUserWithEmail(emailId) {
        try {
            const existingUser = await this.userModel.findOne({ email: emailId });
            if (existingUser) {
                return {
                    status: false,
                    message: this.messages.USER_ALREADY_EXISTS
                };
            } else {
                return {
                    status: true,
                };
            }

        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async getUserWithEmail(email){
        try{
            const userData = await this.userModel.findOne({ email: email}).populate("role_id");
            if (!userData) {
                return {
                    status: false,
                    message: this.messages.USER_NOT_FOUND
                };
            } else {
                return {
                    status: true,
                    data:userData
                };
            }

        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async userBulkWrite(bulkOps) {
        try {
            const result = await this.userModel.bulkWrite(bulkOps);
            return result
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async updateManyUserWithFilter(filter, update) {
        try {
            const result = await this.userModel.updateMany(filter, { $set: update });
            return result
        } catch (e) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async getAccessModule(userId) {
        try {
            const user = await this.userModel.findById(
            this.mongoose.Types.ObjectId(userId)
            ).populate("role_id");

            if (!user || !user.role_id) {
                return []; // No user or no role assigned
            }
            // Return access modules from populated role
            return user.role_id.access_module || [];

        } catch (error) {
            console.error("Error getting access modules:", error);
            return [];
        }
    }

}

module.exports = new UserService();
