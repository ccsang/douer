var crypto = require('crypto')
var md5 = crypto.createHash('md5')

exports.encrypt = function (password) {
    md5.update(password)
    return md5.digest('hex')
}