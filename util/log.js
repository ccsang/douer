var log4js = require('log4js')

log4js.configure({
    appenders: [
        {type: 'console'},
        {type                  : 'dateFile',
         filename              : 'logs/douer.log',
         pattern               : '-yyyy-MM-dd',
         alwaysIncludedPattern : false,
        }
    ],
    replaceConsole: true,
    levels: {
    	dateFileLog : 'INFO'
    }
})

exports.logger = function (name) {
    var logger = log4js.getLogger(name)
    logger.setLevel('INFO')
    return logger
}

exports.use = function (app) {
	app.use(log4js.connectLogger(this.logger("normal"), {level: 'debug', format: ':method :url'}))
}