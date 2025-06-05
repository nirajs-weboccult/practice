// const { handleError } = require('./helpers/error')

class App {
    constructor() {
        this.path = require('path');
        this.createError = require('http-errors');
        this.express = require('express');
        // var ejs = require('ejs');
        this.expressLayout = require('express-ejs-layouts');
        this.bodyParser = require('body-parser');
        this.urlencodedParser = this.bodyParser.urlencoded({ extended: false });
        this.cookieParser = require('cookie-parser');
        this.logger = require('morgan');
        this.expressSession = require('express-session');

        // All admin route files
        this.userRouter = require('./router/v1/user.router');
        this.roleRouter = require('./router/v1/role.router');
        // All app route files
        this.middleware = require('./middleware/index')
        // IMPORT ROUTE
        this.cors = require('cors');
        this.corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        };

        this.helperResponse = require('./helpers/helper-response');
        this.database = require('./database/database');
        this.config = require('./config/config');
        this.app = this.express();

        this.app.use(this.express.json());
        this.app.use(this.logger('dev'));
        this.app.use(this.express.urlencoded({ extended: false }));
        this.app.use(this.cookieParser());

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

        // All admin routes 
        // this.app.use('/cms-management', this.middleware.checkIfSessionExist, this.middleware.checkLogin, this.middleware.checkAccessToken, this.cmsManagementRoute);
        // this.app.use('/insurance-management', this.middleware.checkIfSessionExist, this.middleware.checkLogin, this.middleware.checkAccessToken, this.insuranceManagementRoute);
        // this.app.use('/notifications', this.middleware.checkIfSessionExist, this.middleware.checkLogin, this.middleware.checkAccessToken, this.notificationsRoute);

        this.app.use('/users', this.userRouter);
        this.app.use('/roles', this.roleRouter);
        
        // Default route page
        // this.app.use('/', this.);

        this.http = require('http');
        this.port = this.normalizePort(this.config.port || '3000');

        this.app.set('port', this.port);

        this.server = this.http.createServer(this.app);

        this.server.listen(this.port, () => {
            console.log('Listening to the port: ', this.port || '3000');
        });
        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);
        
    }

    /**
     * Method to normalize some port
     * @param val Value to normalize
     */
    normalizePort(val) {
        const port = parseInt(val, 10);
        if (isNaN(port)) return val;
        if (port >= 0) return port;
        return false;
    }

    /**
     * Event listener for HTTP server "error" event
     * @param error Error to handle
     */
    onError(error) {
        if (error.syscall !== 'listen') throw error;
        const bind =
            typeof this.port === 'string'
                ? 'Pipe ' + this.port
                : 'Port ' + this.port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server "listening" event.
     */
    onListening() {
        const addr = this.address();
        const debug = require('debug')('server');
        const bind =
            typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}

const app = new App();

module.exports = app.app;
