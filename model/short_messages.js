var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_album')

exports.insert = function (args, cb) {
    var sql = 'insert into short_messages(send_user_id,receive_user_id,content) values(?,?,?);'
    var inserts = [args.send_user_id, args.receive_user_id, args.content]
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
    var sql = 'update short_messages set status = 0 where id = ?'
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


exports.delete = function (args, cb) {
    var sql = 'delete from short_messages where id = ?'
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
    var sql = 'select u.id user_id,u.nickname,u.photo,s.id message_id,s.content,s.send_time,s.status from short_messages s\
            inner join user_info u on s.send_user_id = u.id where s.receive_user_id = ? order by s.send_time desc;'
    var inserts = [args.receive_user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.count = function (args, cb) {
    var sql = 'select count(*) where receive_user_id = ? and status = 1'
    var inserts = [args.receive_user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.list_conversation = function (args, cb) {
    var sql = ' select  distinct u.id,u.nickname,u.photo,s.content  from short_messages s \
    inner join user_info u on s.send_user_id = u.id where s.receive_user_id = ? ; ' 
    var inserts = [args.receive_user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })

}