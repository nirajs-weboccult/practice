const jwt = require('jsonwebtoken');
const helperResponse = require('../helpers/helper-response');
const config = require('../config/config')

exports.checkModuleAccess = function(data) {
    return async (req, res, next) => {
        try {
            let moduleAccessArray = req.session.access_module
            if(moduleAccessArray && moduleAccessArray.includes(data)){
                next();
            }else{
                return res.status(401).json({ status: false, message: "Access denied. You do not have the required permissions." });
            }
        } catch (error) {
            console.error('Error checking module access:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

exports.isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, message: 'Unauthorized: No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.commonConfig.SECRET_KEY);
        req.user = decoded;        
        next();
    } catch (error) {
        console.error('Error checking role access:', error);
        return res.status(500).json({ status:false,message: "Invalid Token"});
    }
};

exports.checkLogin = async (req, res, next) => {
    if (helperResponse.getSession(req, 'user')) {
        next();
    } else {
        return res.status(401).json({status:false, message: "Authentication required. Please log in to continue."});
    }
};