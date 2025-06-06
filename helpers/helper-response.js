class HelperResponse {
    constructor() {
        this.logger = require('./logger.js');
        this.jwt = require('jsonwebtoken');
        this.config = require('../config/config');
    }

    /**
     *
     * get session
     *
     * @param  {string}  key
     * @return {object}
     */
    getSession(req, key) {
        return req.session[key];
    }

    /**
     *
     * set session
     *
     * @param  {object}  req
     * @param  {string}  key
     * @param  {object}  data
     * @return {object}
     */
    setSession(req, key, value) {
        req.session[key] = value;
    }

    /**
     *
     * detroy session
     * @param  {object}  request
     * @return {object}
     */
    destroySession(req) {
        req.session.destroy();
    }

    /**
     *
     * generate JWT Token
     *
     * @param  {object}  doc
     * @return {string} jwt encoded string
     */
    generateJWT(doc) {
        const expire = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 24 hours
        const token = this.jwt.sign({ id: doc._id, role: doc.role, email: doc.email, exp: expire }, this.config.commonConfig.SECRET_KEY, { algorithm: "HS512" });
        return {
            token: token,
            expire: new Date(Date.now() + (60 * 60 * 24 * 1000)),
        };
    }

    /**
     *
     * decode jwt token
     *
     * @param  {string}  token
     * @return {object} decoded token
     */
    decodeJWT(token) {
        try {
            return {
                data: this.jwt.verify(token, this.config.commonConfig.SECRET_KEY, "HS512"),
                status: true
            };
        } catch (e) {
            return {
                status: false,
                message: "unauthorized"
            };
        }
    }
}

module.exports = new HelperResponse();
