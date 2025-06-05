class UserService {
    constructor() {
        this.bcrypt = require('bcrypt');
        this.mongoose = require('mongoose');
        this.userModel = require('../models/users');
        this.ErrorHandler = require('../helpers/error').ErrorHandler;
        this.messages = require('../helpers/messages').allMessages;
        this.commonFunction = require('../helpers/common-function');
        this.helperResponse = require('../helpers/helper-response');
    }

    async getUsers(search, limit, offset, sort, order) {
        try {
            const query = search ? { name: new RegExp(search, 'i') } : {};
            const users = await this.userModel
                .find(query)
                .populate({
                    path: 'role_id',       // assuming 'roles' is a field in userModel that references the Role model
                    select: 'name access_modules' // only get these fields from Role model
                })
                .sort({ [sort]: order === 'asc' ? 1 : -1 })
                .skip(offset)
                .limit(limit);
            return users;
        } catch (error) {
            console.log(error);
            return {
                status:false,
                message: this.messages.INTERNAL_SERVER_ERROR
            }
            
        }
    }

    async countUsers(search){

        try{

           // Build query with optional name search and filter for inactive users
            const query = {
                ...(search ? { name: new RegExp(search, 'i') } : {}),
                is_active: 1 // explicitly filtering only inactive users
            };

            const totalUsers = await this.userModel.countDocuments(query);

            return {
                status: true,
                total: totalUsers
            };
        }catch(error){
             console.log(error);
            return {
                status:false,
                message: this.messages.INTERNAL_SERVER_ERROR
            }
        }


    }

    async insertUser(userData) {
        try {
            const existingUser = await this.userModel.findOne({ email: userData.email });
            console.log("existingUser", existingUser);
            
            if (existingUser) {
                console.log("User already exists");
                return {
                    status: false,
                    message: this.messages.USER_ALREADY_EXISTS
                };
            }

            const hashedPassword = await this.bcrypt.hash(userData.password, 10);
            const newUser = new this.userModel({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role_id: this.mongoose.Types.ObjectId(userData.role_id),
                is_active: userData.is_active || 1, // Default to active
                gender: userData.gender
            });

            await newUser.save();
            // how to give error for Db
            
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

    async findUserById(userId){
        try{
            const userData = await this.userModel.findOne({_id:this.mongoose.Types.ObjectId(userId),is_active:1})
            return userData
        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async updateUserById(userId,userData){
        try{
            userData["updatedAt"] = new Date()
            const updateUser = await this.userModel.findOneAndUpdate({_id:this.mongoose.Types.ObjectId(userId)},{$set:userData},{new: true})
            return {
                status:true,
                data:updateUser
            }
        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

     async deleteUserById(userId){
        try{
            const deleteUser = await this.userModel.findOneAndDelete({_id:this.mongoose.Types.ObjectId(userId)})
            return {
                status:true,
                data:deleteUser
            }
        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }
    

}

module.exports = new UserService();
