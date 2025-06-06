/**
 * Setting Configuration Class
 */
class Config {
    constructor() {
        this.dotenv = require('dotenv');
        this.path = require('path');
        this.Joi = require('joi');
        this.dotenv.config({ path: this.path.join(__dirname, '../.env') });
        this.envVarsSchema = this.Joi.object()
            .keys({
                NODE_ENV: this.Joi.string()
                    .valid('production', 'development', 'staging')
                    .required(),
                PORT: this.Joi.number().default(4000),
                DB_NAME: this.Joi.string()
                    .required()
                    .description('Database Name'),
                MONGO_CNNSTR: this.Joi.string()
                    .required()
                    .description('Mongo DB url'),
                SECRET_KEY: this.Joi.string()
                    .required()
                    .description('Secret key'),
            })
            .unknown()

        ;({ value: this.envVars, error: this.error } = this.envVarsSchema
            .prefs({ errors: { label: 'key' } })
            .validate(process.env));

        if (this.error) {
            console.log(`Config validation error: ${this.error.message}`);
            
        }

        this.port = this.envVars.PORT;
        this.commonConfig = {
            APP_NAME: 'User Role Management',
            APP_DESCRIPTION: 'User Role Management',
            SECRET_KEY: this.envVars.SECRET_KEY,
        };
        this.nodeEnv = this.envVars.NODE_ENV;
        this.mongoStr = this.envVars.MONGO_CNNSTR;
        this.dbName = this.envVars.DB_NAME;
    }
}

/**
 * Setting object to return
 */
const config = new Config();

/**
 * Exporting Module
 */
module.exports = config;
