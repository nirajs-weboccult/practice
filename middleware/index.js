exports.checkModuleAccess = moduleName=> {
    return async (req, res, next) => {
        try {
            
        } catch (error) {
            console.error('Error checking module access:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

exports.isAuthenticated = async (req, res, next) => {
    try {
        console.log("Checking authentication for role:");
        
        // Implement role access check logic here
        next();
    } catch (error) {
        console.error('Error checking role access:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
