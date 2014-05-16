var log4js = require('log4js')

log4js.configure({
    appenders: [
        {type: 'console'},
        {type                  : 'datefile',
         filename              : 'logs/douer.log',
         pattern               : '_yyyy-MM-dd',
         alwaysIncludedPattern : false,
         category              : 'datefilelog'
        }
    ],
    replaceConsole: true,
    levels: {
    	datefilelog : 'DEBUG'
    }
})

exports.logger = function (name) {
    var logger = log4js.getLogger(name)
    logger.setLevel('DEBUG')
    return logger
}

exports.use = function (app) {
	app.use(log4js.connectLogger(this.logger("normal"), {level: 'debug', format: ':method :url'}))
}