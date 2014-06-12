var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_friends')

exports.insert = function (args, cb) {
    var sql = 'insert into friends(user_id, friend_id) values(?,?);\
               insert into friends(user_id, friend_id) values(?,?);'
    var inserts = [args.user_id, args.friend_id, args.friend_id, args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.insert_self = function (args, cb) {
    var sql = 'insert into friends(user_id, friend_id) values(?,?);'

    var inserts = [args.id, args.id]
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
    var sql = 'update friends set comment = ? where id = ?;'
    var inserts = [args.comment, args.id]
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
    var sql = 'delete from friends where user_id = ? and friend_id = ?'
    var inserts = [args.user_id, args.friend_id]
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
    var sql = 'select u.id,u.nickname,u.photo,u.sex from friends f \
        inner join user_info u on u.id = f.friend_id where user_id = ?;'
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