var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_album')

exports.insert = function (args, cb) {
    var sql = 'insert into message(user_id, poster_id, content) values(?,?,?);'
    var inserts = [args.user_id, args.poster_id, args.content]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

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
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}


exports.delete = function (args, cb) {
    var sql = 'delete from message where id = ?'
    var inserts = [args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}


exports.list = function (args, cb) {
    var sql = ''
    var inserts = []
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}