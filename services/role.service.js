class RoleService  {
    constructor() {
        this.bcrypt = require('bcrypt');
        this.mongoose = require('mongoose');
        this.roleModel = require('../models/role');
        this.messages = require('../helpers/messages').allMessages;
        this.helperResponse = require('../helpers/helper-response');
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

        async findRoleById(roleId){
        try{
            const roleData = await this.roleModel.findOne({_id:this.mongoose.Types.ObjectId(roleId),is_active:1})
            return roleData
        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async updateRoleById(roleId,roleData){
        try{
            roleData["updatedAt"] = new Date()
            const updateRole = await this.roleModel.findOneAndUpdate({_id:this.mongoose.Types.ObjectId(roleId)},{$set:roleData},{new: true})
            return {
                status:true,
                data:updateRole
            }
        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

     async deleteRoleById(roleId){
        try{
            const deleteRole = await this.roleModel.findOneAndDelete({_id:this.mongoose.Types.ObjectId(roleId)})
            return {
                status:true,
                data:deleteRole
            }
        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

    async removeAccessModule(roleId,module_name){
        try{
            const result = await this.roleModel.updateOne(
                { _id: this.mongoose.Types.ObjectId(roleId) },
                { $pull: { access_module: module_name } }
            );
            return result

        }catch(error){
            console.log(error);
            return {
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            };
        }
    }

}

module.exports = new RoleService();
