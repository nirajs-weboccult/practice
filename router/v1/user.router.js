class UsersRoute {
    constructor() {
        this.router = require('express').Router();
        this.middleware = require('../../middleware/index');
        this.userController = require('../../controller/user.controller');
        this.setRoutes();
    }

    setRoutes() {
        
    //    give me CRUD APIs
        this.router.get('/list', this.middleware.isAuthenticated, this.userController.listUsers.bind(this.userController));
        this.router.post('/create', this.middleware.isAuthenticated, this.userController.createUser.bind(this.userController));
        this.router.put('/update/:id', this.middleware.isAuthenticated, this.userController.updateUser.bind(this.userController));
        this.router.delete('/delete/:id', this.middleware.isAuthenticated, this.userController.deleteUser.bind(this.userController));
        this.router.put('/status-change/:id', this.middleware.isAuthenticated, this.userController.userStatusChange.bind(this.userController));

        // this.router.get('/view/:id', this.middleware.isAuthenticated, this.userController.viewUser.bind(this.userController));
        // // add is_active user API
        // this.router.put('/activate/:id', this.middleware.isAuthenticated, this.userController.activateUser.bind(this.userController));
        // this.router.put('/deactivate/:id', this.middleware.isAuthenticated, this.userController.deactivateUser.bind(this.userController));
        // // add forgot password API
        // this.router.post('/reset-password', this.userController.resetPassword.bind(this.userController));
        // add login API
    }
}

const router = new UsersRoute();
module.exports = router.router;
