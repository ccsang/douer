var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_blog')

exports.insert = function (args, cb) {
    var sql = 'insert into photo(user_id,album_id,path,comment) values(?,?,?,?)'
    var inserts = [args.user_id, args.album_id, args.path, args.comment]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
        })
    })
}

exports.update = function (args, cb) {
    var sql = 'update phote set album_id = ? , path = ? , comment = ? where id = ?'
    var inserts = [args.album_id, args.path, args.comment, args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
        })
    })
}

exports.get_by_id = function (args, cb) {
    var sql = 'select id, user_id, album_id , path , comment where id = ?'
    var inserts = [args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}


exports.get_list_by_user = function (args, cb) {
    var sql = ''
    var inserts = []
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.get_list_by_album = function (args, cb) {
    var sql = 'select p.id, p.user_id, a.album_name ,p.album_id , p.path, p.comment \
               from photo p inner join album a on a.id = p.album_id where album_id = ?'
    var inserts = [args.album_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.del_by_album = function (args, cb) {
    var sql = 'delete from photo where album_id = ? and user_id = ?;'
    var inserts = [args.album_id, args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}