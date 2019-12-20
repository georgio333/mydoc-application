var log4js = require('log4js');
log4js.clearAppenders()
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('mydoc-test.log'));
var loggerN = log4js.getLogger('Test');
loggerN.setLevel('INFO');

var getLogger = function () {
    return loggerN;
};

exports.logger = getLogger();
