var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_review')

exports.insert = function (args, cb) {
    var sql = 'insert into review(type,review_id,user_id,content) values(?,?,?,?);'
    var inserts = [args.type, args.review_id, args.user_id, args.content]
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
    var sql = 'delete from review where id = ? ;'
    var inserts = [args.review_id]
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
    var sql = 'select review.id, type, review_id, user_id, content ,review_time, user_info.nickname,user_info.photo from review \
               inner join user_info on review.user_id = user_info.id where review_id = ? and type = ? \
               order by review_time desc;'
    var inserts = [args.review_id, args.type]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}



