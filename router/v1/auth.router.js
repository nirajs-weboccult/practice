class AuthRoute {
    constructor() {
        this.router = require('express').Router();
        this.middleware = require('../../middleware/index');
        this.authController = require('../../controller/auth.controller');
        this.setRoutes();
    }

    setRoutes() {
        // Authentication routes
        this.router.post('/login', this.authController.login.bind(this.authController));
        this.router.post('/signup', this.authController.signUp.bind(this.authController)); 
    }
}

const router = new AuthRoute();
module.exports = router.router;
