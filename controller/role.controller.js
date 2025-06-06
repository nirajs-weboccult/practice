const baseController = require('./base.controller');
class RoleController extends baseController {
    constructor() {
        super();
        this.roleService = require('../services/role.service');
        this.validation = require('../validations/role.validations');
        this.es6BindAll(this, []);
    }

    async listRoles(req, res) {
        try {
            const search = req.query.search?.trim() || '';
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 10);
            const offset = (page - 1) * limit;
            const sort = req.query.sort || 'createdAt';
            const order = req.query.order === 'asc' ? 'asc' : 'desc'; // default to 'desc' if invalid

            const [roles, totalRolesData] = await Promise.all([
                this.roleService.getRoles(search, limit, offset, sort, order),
                this.roleService.countRoles(search)
            ]);
            const totalRoles = totalRolesData.total || 0;
            const totalPages = Math.ceil(totalRoles / limit);

            return res.status(200).json({
                status: true,
                roles,
                totalRoles,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({ message: this.messages.INTERNAL_SERVER_ERROR });
        }
    }

    async createRole(req, res) {
        try {
            const { name, access_module, is_active } = req.body;
            const { error } = this.validation.validateCreateRole.validate(req.body);
            if (error) {
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }
            const newRole = await this.roleService.insertRole({ name, access_module, is_active });
            if (!newRole.status) {
                return res.status(400).json({ status: false, message: newRole.message });
            }
            return res.status(201).json(newRole);
        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({ status: false, message: this.messages.INTERNAL_SERVER_ERROR });
        }
    }

    async updateRole(req, res) {
        try {
            const roleId = req.params.id;
            const roleData = req.body;
            const { error } = this.validation.validateUpdateRole.validate(req.body);
            if (error) {
                console.log(error);
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }
            const existingRole = await this.roleService.findRoleById(roleId)
            if (!existingRole) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.ROLE_NOT_FOUND
                });
            }
            const updatedRole = await this.roleService.updateRoleById(roleId, roleData)
            if (updatedRole.status === false) {
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.ROLE_UPDATED_SUCCESSFULLY
            });
        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({ status: false, message: this.messages.INTERNAL_SERVER_ERROR });
        }
    }


    async deleteRole(req, res) {
        try {
            const roleId = req.params.id;

            const existingRole = await this.roleService.findRoleById(roleId)
            if (!existingRole) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.ROLE_NOT_FOUND
                });
            }

            const deleteRole = await this.roleService.deleteRoleById(roleId)
            if (deleteRole.status === false) {
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.ROLE_DELETE_SUCCESSFULLY
            });
        } catch (error) {
            console.error("Delete User error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            });
        }
    }

    async roleStatusChange(req, res) {
        try {
            const roleId = req.params.id;
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
            const updatedRole = await this.roleService.updateRoleById(roleId, statusObj)
            if (updatedRole.status === false) {
                return res.status(200).json({
                    status: false,
                    message: this.messages.DATABASE_ERR
                });
            }
            return res.status(200).json({
                status: true,
                message: this.messages.ROLE_UPDATED_SUCCESSFULLY
            });
        } catch (error) {
            console.error("Change Status:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR
            });
        }
    }


    async removeAccessModuleFromRole(req, res) {
        try {
            const roleId  = req.params.id;
            const { module_name } = req.body;

            if (!module_name) {
                return res.status(400).json({
                    status: false,
                    message: this.messages.ENTER_VALID_DETAILS
                });
            }

            const result = await this.roleService.removeAccessModule(roleId,module_name)        
            if (result.modifiedCount === 0) {
                return res.status(404).json({
                    status: false,
                    message: this.messages.ROLE_NOT_FOUND
                });
            }

            return res.status(200).json({
                status: true,
                message: `Module '${module_name}' removed from role`
            });

        } catch (error) {
            console.error("Remove module error:", error);
            return res.status(500).json({
                status: false,
                message: this.messages.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

}

module.exports = new RoleController();