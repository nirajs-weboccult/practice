class RoleService  {
    constructor() {
        this.bcrypt = require('bcrypt');
        this.mongoose = require('mongoose');
        this.roleModel = require('../models/role');
        this.ErrorHandler = require('../helpers/error').ErrorHandler;
        this.messages = require('../helpers/messages').allMessages;
        this.commonFunction = require('../helpers/common-function');
        this.helperResponse = require('../helpers/helper-response');
        this.ErrorHandler = require('../helpers/error').ErrorHandler;
    }

    async getRoles(search, limit, offset, sort, order) {
        try {
            const query = search ? { name: new RegExp(search, 'i') } : {};
            query["is_active"] = 1
            const roles = await this.roleModel.find(query).sort({ [sort]: order === 'asc' ? 1 : -1 }).skip(offset).limit(limit);
            return roles;
        } catch (error) {
            console.log(error)
            return {
                status:false,
                message: this.messages.INTERNAL_SERVER_ERROR
            }
        }
    }

    async countRoles(search){

        try{
           // Build query with optional name search and filter for inactive users
            const query = {
                ...(search ? { name: new RegExp(search, 'i') } : {}),
                is_active: 1 // explicitly filtering only inactive users
            };
            const totalRoles = await this.roleModel.countDocuments(query);
            return {
                status: true,
                total: totalRoles
            };
        }catch(error){
             console.log(error);
            return {
                status:false,
                message: this.messages.INTERNAL_SERVER_ERROR
            }
        }
    }

    async insertRole(roleData) {
        try {
            const existingRole = await this.roleModel.findOne({ name: roleData.name , is_active: 1 });
            if (existingRole) {
                console.log("Role already exists");
                return {
                    status: false,
                    message: this.messages.ROLE_ALREADY_EXISTS
                };
            }
            // unique access_module in array
            if (roleData.access_module && Array.isArray(roleData.access_module)) {
                const uniqueModules = [...new Set(roleData.access_module)];
                roleData.access_module = uniqueModules;
            } else {
                roleData.access_module = [];
            }

            const newRole = new this.roleModel({
                name: roleData.name,
                access_module: roleData.access_module,
                is_active: roleData.is_active || 1 // Default to active
            });

            await newRole.save();
            return {
                status: true,
                message: this.messages.ROLE_CREATED_SUCCESSFULLY,
                role: newRole
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }   
}

module.exports = new RoleService();
