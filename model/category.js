var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_category')

exports.insert = function (args, cb) {
    var sql = ' insert into category(user_id,category_name) values (?, ?)'
    var inserts = [args.user_id, args.category_name]
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
    var sql = 'update category set category_name = ? where id = ? ;'
    var inserts = [args.category_name, args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql: ' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.del = function (args, cb) {
    var sql = 'delete from category where id = ? ;'
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
    var sql = 'select id, category_name from category where user_id = ?'
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