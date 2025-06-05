class AuthRoute {
    constructor() {
        this.router = require('express').Router();
        this.middleware = require('../../middleware/index');
        this.dashboardController = require('../../controller/auth.controller');
        this.setRoutes();
    }

    setRoutes() {
        
        // Authentication routes
        this.router.post('/login', this.dashboardController.login.bind(this.dashboardController));
        // create Signup API
        this.router.post('/signup', this.dashboardController.signup.bind(this.dashboardController)); 
    }
}

const router = new AuthRoute();
module.exports = router.router;
