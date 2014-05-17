var crypto = require('crypto')
var md5 = crypto.createHash('md5')

exports.encrypt = function (password) {
    return crypto.createHash('md5').update(password).digest('hex')
}