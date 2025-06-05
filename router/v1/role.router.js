class RolesRoute {
    constructor() {
        this.router = require('express').Router();
        this.middleware = require('../../middleware/index');
        this.roleController = require('../../controller/role.controller');
        this.setRoutes();
    }

    setRoutes() {
        
        // Give me CRUD APIs for roles
        this.router.get('/list', this.middleware.isAuthenticated, this.roleController.listRoles.bind(this.roleController));
        this.router.post('/create', this.middleware.isAuthenticated, this.roleController.createRole.bind(this.roleController));
        // this.router.put('/update/:id', this.middleware.isAuthenticated, this.roleController.updateRole.bind(this.roleController));
        // this.router.delete('/delete/:id', this.middleware.isAuthenticated, this.roleController.deleteRole.bind(this.roleController));
        // this.router.get('/view/:id', this.middleware.isAuthenticated, this.roleController.viewRole.bind(this.roleController));
        // // Add is_active role API
        // this.router.put('/activate/:id', this.middleware.isAuthenticated, this.roleController.activateRole.bind(this.roleController));
        // this.router.put('/deactivate/:id', this.middleware.isAuthenticated, this.roleController.deactivateRole.bind(this.roleController));
    }
}

const router = new RolesRoute();
module.exports = router.router;
