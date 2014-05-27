var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_broadcast')

exports.insert = function (args, cb) {
    var sql = 'insert into broadcast(user_id, content) values(?,?)'
    var inserts = [args.user_id, args.content]
    sql = mysql.format(sql, inserts)
    logger.info("sql: " + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.update = function (args, cb) {
    var sql = ''
    var inserts = []
    sql = mysql.format(sql, inserts)
    logger.info("sql: " + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.delete = function (args, cb) {
    var sql = ''
    var inserts = []
    sql = mysql.format(sql, inserts)
    logger.info("sql: " + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.list = function (args, cb) {
    var sql = 'select b.id,b.user_id,u.nickname,b.content,b.post_time from broadcast b \
    inner join user_info u on b.user_id = u.id where user_id = ? order by post_time desc'
    var inserts = [args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info("sql: " + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}