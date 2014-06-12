var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_add_friend_msg')

exports.insert = function (args, cb) {
    var sql = 'insert into add_friend_msg(user_id,send_user_id,content) value(?,?,?)'
    var inserts = [args.user_id, args.send_user_id, args.content]
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
    var sql = 'update add_friend_msg set status = ? where user_id = ? and send_user_id = ?;'
    var inserts = [args.status, args.user_id, args.send_user_id]
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
    var sql = ''
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
    var sql = 'select distinct user_id, content, u.nickname, u.photo\
    from add_friend_msg a inner join user_info u on a.user_id = u.id \
    where send_user_id = ? and a.status = 1;'
    var inserts = [args.send_user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}