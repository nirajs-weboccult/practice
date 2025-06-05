/**
 * This class will be extended by all other controllers
 */
class BaseController {
    constructor() {
        this.mongoose = require('mongoose');
        this.commonFunction = require('../helpers/common-function');
        this.bcrypt = require('bcrypt');
        this.logger = require('../helpers/logger');
        this.helperResponse = require('../helpers/helper-response');
        this.es6BindAll = require('es6bindall');
        this.ErrorHandler = require('../helpers/error').ErrorHandler;
        this.config = require('../config/config');
        this.fs = require('fs');
        this.messages = require('../helpers/messages').allMessages;
    }
}

module.exports = BaseController;