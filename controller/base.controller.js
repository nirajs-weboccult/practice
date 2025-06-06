/**
 * This class will be extended by all other controllers
 */
class BaseController {
    constructor() {
        this.mongoose = require('mongoose');
        this.bcrypt = require('bcrypt');
        this.logger = require('../helpers/logger');
        this.helperResponse = require('../helpers/helper-response');
        this.es6BindAll = require('es6bindall');
        this.config = require('../config/config');
        this.fs = require('fs');
        this.jwt = require('jsonwebtoken');
        this.messages = require('../helpers/messages').allMessages;
    }
}

module.exports = BaseController;