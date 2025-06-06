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
        this.connect();
    }

    /**
     * Connect to DataBase
     */
    connect() {
        this.mongoose
            .connect(this.config.mongoStr, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(async () => {
                console.log("Database Connected !")
                
            })
            .catch((err) => {
                console.log('----err--in----', err);
            });
    }

    async clearDataBase() {
        return await this.seed.clearDataBase()
    }
}

module.exports = new DataBase();
