class UsersRoute {
    constructor() {
        this.router = require('express').Router();
        this.middleware = require('../../middleware/index');
        this.userController = require('../../controller/user.controller');
        this.setRoutes();
    }

    setRoutes() {
        
        this.router.get('/list',  this.userController.listUsers.bind(this.userController));
        this.router.post('/create', this.userController.createUser.bind(this.userController));
        this.router.put('/update/:id', this.userController.updateUser.bind(this.userController));
        this.router.delete('/delete/:id',  this.userController.deleteUser.bind(this.userController));
        this.router.put('/status-change/:id', this.userController.userStatusChange.bind(this.userController));
        this.router.put('/bulk-update/:id',  this.userController.updateManyUsersWithDifferentData.bind(this.userController));
        this.router.put('/update-multiple/:id', this.userController.updateMultipleUsers.bind(this.userController));
        this.router.get('/:userId/check-module-access/:moduleName', this.userController.checkModuleAccess.bind(this.userController));

    }
}

const router = new UsersRoute();
module.exports = router.router;
