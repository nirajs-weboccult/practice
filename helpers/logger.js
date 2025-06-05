class Logger {
    constructor() {
        this.fs = require('fs');
        if (!this.fs.existsSync('logs')) {
            this.fs.mkdirSync('logs');
        }
        this.objectSize = require('object-sizeof');
    }

    /**
     *
     * log error
     *
     * @param  {string/Object}  text
     * @return append log in file
     */
    logError(title, text) {
        var errLog = `Error :${title} \n ${text} \n \n TimeStamp : ${new Date()} \n ============================== \n\n`;
        let dateString = new Date().toISOString();
        this.fs.appendFile(
            `logs/${dateString.split('T')[0]}_error.log`,
            errLog,
            function (err) {}
        );
    }

    /**
     *
     * Api Calls
     *
     * @param  {string}  type
     * @param  { string}  path
     * @param  {Object}  text
     * @return append apis in file
     */
    logCall(path, type, request) {
        // var apiLog = type +" : " + path + "\n Request Data: " + JSON.stringify(request) + "\n TimeStamp :"+ new Date() +"\n ============================== \n\n"
        var apiLog = `${type} : ${path} \n Request Data: ${JSON.stringify(request)} \n TimeStamp : ${new Date()} \n ============================== \n\n"`;
        let dateString = new Date().toISOString();
        this.fs.appendFile(
            `logs/${dateString.split('T')[0]}_calls.log`,
            apiLog,
            function (err) {}
        );
    }

    /**
     * @param  {string} path
     * @param  {string} type
     * @param  {object} data
     * @param  {boolean} status
     */
    logStoreDatabase(path, type, data, status){
        let dataSize = this.objectSize(data);
        let logObject = {
            api: path,
            type: type,
            status: status,
            sizeOfData: dataSize
        };
        // this.loggerService.insertLog(logObject);
    }
}

module.exports = new Logger();
