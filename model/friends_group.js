var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_groups')

exports.insert = function (args, cb) {
    var sql = 'inserts into friends_group(user_id,group_name) values(?,?);'
    var inserts = [args.user_id, args.group_name]
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
    var sql = 'update friends_group set group_name = ? where id = ?'
    var inserts = [args.group_name, args.id]
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
    var sql = 'delete from friends_group where id = ?;'
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
    var sql = 'select id, group_name from friends_group where user_id = ?'
    var inserts = [args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}