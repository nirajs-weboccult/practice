class RolesRoute {
    constructor() {
        this.router = require('express').Router();
        this.middleware = require('../../middleware/index');
        this.roleController = require('../../controller/role.controller');
        this.setRoutes();
    }

    setRoutes() {
        this.router.get('/list', this.roleController.listRoles.bind(this.roleController));
        this.router.post('/create', this.roleController.createRole.bind(this.roleController));
        this.router.put('/update/:id',  this.roleController.updateRole.bind(this.roleController));
        this.router.delete('/delete/:id',  this.roleController.deleteRole.bind(this.roleController));
        this.router.put('/status-change/:id',  this.roleController.roleStatusChange.bind(this.roleController));
        this.router.put('/remove-access-module/:id',  this.roleController.removeAccessModuleFromRole.bind(this.roleController));       
    }
}

const router = new RolesRoute();
module.exports = router.router;
