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
            // please validate the request if needed
            const search = req.query.search?.trim() || '';
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 10);
            const offset = (page - 1) * limit;
            const sort = req.query.sort || 'createdAt';
            const order = req.query.order === 'asc' ? 'asc' : 'desc'; // default to 'desc' if invalid

            // Fetch users and total count
            const [roles, totalRolesData] = await Promise.all([
                this.roleService.getRoles(search, limit, offset, sort, order),
                this.roleService.countRoles(search)
            ]);
            console.log(totalRolesData);
            
            const totalRoles = totalRolesData.total || 0;
            const totalPages = Math.ceil(totalRoles / limit);

            // Send paginated response
            return res.status(200).json({
                status: true,
                roles,
                totalRoles,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createRole(req, res) {
        try {
            console.log(req.body);
            
            const { name, access_module , is_active  } = req.body;
            const {error} = this.validation.validateCreateRole.validate(req.body);
            if (error) {
                return res.status(400).send({
                    status: false,
                    message: error.details?.[0]?.message || error.message,
                    type: 'ValidationError',
                });
            }
            const newRole = await this.roleService.insertRole({ name, access_module , is_active  });
            if (!newRole.status) {
                return res.status(400).json({ status: false, message: newRole.message });
            }
            return res.status(201).json({status: true, message: 'Role created successfully !', role: newRole });
        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
    }

//     async removeAccessModuleFromRole(req, res) {
//   try {
//     const { roleId } = req.params;
//     const { moduleName } = req.body;

//     if (!moduleName) {
//       return res.status(400).json({
//         status: false,
//         message: "Module name is required"
//       });
//     }

//     const result = await this.roleModel.updateOne(
//       { _id: roleId },
//       { $pull: { access_module: moduleName } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "Role not found or module not present"
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: `Module '${moduleName}' removed from role`
//     });

//   } catch (error) {
//     console.error("Remove module error:", error);
//     return res.status(500).json({
//       status: false,
//       message: this.messages.INTERNAL_SERVER_ERROR || "Something went wrong"
//     });
//   }
// }

}

module.exports = new RoleController();