class App {
    constructor() {
        // Core Modules & Third-party packages
        this.path = require('path');
        this.createError = require('http-errors');
        this.express = require('express');
        this.expressLayout = require('express-ejs-layouts');
        this.bodyParser = require('body-parser');
        this.urlencodedParser = this.bodyParser.urlencoded({ extended: false });
        this.cookieParser = require('cookie-parser');
        this.logger = require('morgan');
        this.expressSession = require('express-session');

        // Routers
        this.userRouter = require('./router/v1/user.router');
        this.roleRouter = require('./router/v1/role.router');
        this.authRouter = require('./router/v1/auth.router');

        // Middlewares (authentication and access control)
        this.middleware = require('./middleware/index');

        // CORS Configuration
        this.cors = require('cors');
        this.corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200, // for legacy browsers
        };

        // Helpers & Configs
        this.helperResponse = require('./helpers/helper-response');
        this.database = require('./database/database');
        this.config = require('./config/config');

        // Initialize Express App
        this.app = this.express();

        // Middleware: JSON parser
        this.app.use(this.express.json());

        // Middleware: HTTP request logger
        this.app.use(this.logger('dev'));

        // Middleware: URL-encoded data parser
        this.app.use(this.express.urlencoded({ extended: false }));

        // Middleware: Cookie parser
        this.app.use(this.cookieParser());

        // Middleware: Session management
        this.app.use(
            this.expressSession({
                secret: this.config.commonConfig.SECRET_KEY,
                cookie: {
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                },
                resave: true,
                saveUninitialized: true,
            })
        );

        /**
         * Routing
         * Apply route-level middlewares: isAuthenticated and checkModuleAccess
         */
        this.app.use(
            '/users',
            this.middleware.isAuthenticated,
            this.middleware.checkModuleAccess("user_access"),
            this.userRouter
        );

        this.app.use(
            '/roles',
            this.middleware.isAuthenticated,
            this.middleware.checkModuleAccess("role_access"),
            this.roleRouter
        );

        // Auth routes without auth middleware
        this.app.use('/', this.authRouter);

        // Create HTTP Server
        this.http = require('http');
        this.port = this.normalizePort(this.config.port || '3000');
        this.app.set('port', this.port);

        // Initialize server
        this.server = this.http.createServer(this.app);

        // Start server
        this.server.listen(this.port, () => {
            console.log('Listening to the port: ', this.port || '3000');
        });

        // Attach error and listening event handlers
        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);
    }

    /**
     * Normalize the port into a number, string, or false
     * @param val Port value from config or default
     */
    normalizePort(val) {
        const port = parseInt(val, 10);
        if (isNaN(port)) return val;
        if (port >= 0) return port;
        return false;
    }

    /**
     * Event listener for HTTP server "error" event
     * Handles permission and address-in-use errors
     * @param error Error object
     */
    onError(error) {
        if (error.syscall !== 'listen') throw error;

        const bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event
     * Logs server bind information for debugging
     */
    onListening() {
        const addr = this.address(); // 'this' must be bound if called as instance method
        const debug = require('debug')('server');
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}

// Instantiate and export the app
const app = new App();
module.exports = app.app;
