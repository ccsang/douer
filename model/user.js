var db = require('../db/db_util')
var mysql = require('mysql')
var logger = require('../util/log').logger('model_user')

exports.insert = function (args, cb) {
    var sql = 'insert into user_info(email,password,nickname,photo) values(?,?,?,?);'
    var inserts = [args.email, args.password, args.nickname, '/images/default-avatar.jpg']
    sql = mysql.format(sql, inserts)
    logger.debug("sql:" + sql)
    
    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error("Insert data failed. " + err)
                return {ok : 0}
            }
            cb(rows)
            conn.release()
        })
    })
}

exports.login = function (args, cb) {
    var sql = 'select * from user_info where email = ? and password = ?;'
    var inserts = [args.email, args.password]
    sql = mysql.format(sql, inserts)
    logger.debug("sql:" + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error("select user_info failed, email : " + args.email)
                return {ok : 0}
            }

            cb(rows)
            conn.release()
        })
    })
}

exports.update = function (args, cb) {
    var sql = 'update user_info set email = ? , nickname = ?, sex = ? ,birthday = ?, \
        city = ?, hometown = ?, school = ? where id = ?'
    var inserts = [args.email, args.nickname, args.sex, args.birthday, args.city, 
        args.hometown, args.school, args.id]
    sql = mysql.format(sql, inserts)
    logger.info("sql: " + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.update_avatar = function (args, cb) {
    var sql = 'update user_info set photo = ? where id = ?'
    var inserts = [args.photo, args.id]
    sql = mysql.format(sql, inserts)
    logger.info('sql :' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.get_by_id = function (args, cb) {
    var sql = 'select id, email, nickname, sex, birthday, city, hometown, school, photo from user_info where id = ?;'
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

exports.find_by_nickname = function (args, cb) {
    var sql = 'select id, email, nickname, sex, photo, city\
               from user_info where nickname like ? ;'
    var inserts = ['%' + args.nickname + '%']
    sql = mysql.format(sql, inserts)
    logger.info('sql:' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}