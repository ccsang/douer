var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_album')

exports.insert = function (args, cb) {
    var sql = 'insert into album(user_id,album_name,cover) values (?,?,?)'
    var inserts = [args.user_id, args.album_name, '/images/default-cover.jpg']
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
    var sql = 'update album set album_name = ?, cover = ? where id = ?'
    var inserts = [args.album_name, args.cover, args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql:' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.del = function (args, cb) {
    var sql = 'delete from album where id = ?;'
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
    var sql = 'select id, user_id, album_name, cover from album where user_id = ?'
    var inserts = [args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql:' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.get_by_id = function (args, cb) {
    var sql = 'select id, user_id, album_name , cover from album where id = ? ;'
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
