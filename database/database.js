/**
 * DataBase Configuration Class
 */

class DataBase {
    /**
     * Constructor
     */
    constructor() {
        this.config = require('../config/config');
        this.messages = require('../helpers/messages').allMessages;
        this.mongoose = require('mongoose');
        this.ErrorHandler = require('../helpers/error').ErrorHandler;
        this.connect();
    }

    /**
     * Connect to DataBase
     */
    connect() {
        this.mongoose
            .connect(this.config.mongoStr, {
                // useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // user: process.env.MONGO_USERNAME,
                // pass: process.env.MONGO_PASSWORD,
                // auth: { authSource: "admin" }
            })
            .then(async () => {
                if (this.config.clearSeed == 1) {
                    console.log('----CLEAR SEED TRUE----');
                    await this.seed.clearSeed();
                } else {
                    console.log('----CLEAR SEED NOT RUN----');
                }
                if (this.config.isSeed == 1) {
                    console.log('----SEED TRUE----');
                    await this.seed.connect();
                } else {
                    console.log('----SEED NOT RUN----');
                }
                
            })
            .catch((err) => {
                console.log('----err--in----', err);
                this.ErrorHandler(err, this.messages.DATABASE_CONN_ERR);
            });
    }

    async clearDataBase() {
        return await this.seed.clearDataBase()
    }
}

module.exports = new DataBase();
