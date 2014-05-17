var db = require('../db/db_util')
var mysql = require('mysql')
var logger = require('../util/log').logger('model_user')

exports.insert = function (args, cb) {
    var sql = 'insert into user_info(email,password,nickname) values(?,?,?);'
    var inserts = [args.email, args.password, args.nickname]
    sql = mysql.format(sql, inserts)
    logger.debug("sql:" + sql)
    
    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error("Insert data failed. " + err)
                return {ok : 0}
            }
            cb(rows)
            conn.release()
        })
    })
}

exports.login = function (args, cb) {
    var sql = 'select * from user_info where email = ? and password = ?;'
    var inserts = [args.email, args.password]
    sql = mysql.format(sql, inserts)
    logger.debug("sql:" + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error("select user_info failed, email : " + args.email)
                return {ok : 0}
            }

            cb(rows)
            conn.release()
        })
    })
}