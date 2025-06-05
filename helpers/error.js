const logger = require('./logger');

exports.ErrorHandler = async function (error, generated_from) {
    new Error(generated_from, error.message);
    logger.logError(generated_from, error.message);
    return {
        status: 'error',
        code: 500,
        message: error.message,
    };
};
