var mysql = require('mysql')
var logger = require('../util/log').logger('db_util')
var pool = mysql.createPool({
	connectionLimit    : 20,
	host               : '192.168.33.11',
    database           : 'douer',
	user               : 'root',
	password           : 'root',
    multipleStatements : true
})

exports.get_connection = function (cb) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('Get database connection failed. ' + err)
            return {ok : 0}
        }
        cb(conn)
    })
}

