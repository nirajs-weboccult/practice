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
                // IS_SEED: this.Joi.number()
                //     .required()
                //     .description('Seeding Variable'),
                // CLEAR_SEED: this.Joi.number()
                //     .required()
                //     .description('Clear Seeding Variable'),
                // REGEX_SEARCH: this.Joi.string()
                //     .required()
                //     .description("Regex search status"),
                // FIREBASE_MESSAGING_TOKEN: this.Joi.string()
                //     .required()
                //     .description("API key for Cloud Messaging service Firebase"),
                // SOCKET_SERVER_PORT: this.Joi.string()
                //     .required()
                //     .description("Socket server port")
            })
            .unknown()

        // Object.assign(this, { value: envVars, error } = this.envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env))
        ;({ value: this.envVars, error: this.error } = this.envVarsSchema
            .prefs({ errors: { label: 'key' } })
            .validate(process.env));

        if (this.error) {
            throw new Error(`Config validation error: ${this.error.message}`);
        }

        this.port = this.envVars.PORT;
        this.commonConfig = {
            APP_NAME: 'Rymedy Mobile Application',
            APP_DESCRIPTION: 'Rymedy Mobile Application',
            SECRET_KEY: this.envVars.SECRET_KEY,
        };
        this.nodeEnv = this.envVars.NODE_ENV;
        this.mongoStr = this.envVars.MONGO_CNNSTR;
        this.isSeed = this.envVars.IS_SEED;
        this.clearSeed = this.envVars.CLEAR_SEED;
        this.dbName = this.envVars.DB_NAME;
        this.regexSearch = this.envVars.REGEX_SEARCH;
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
