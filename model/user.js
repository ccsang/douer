var db = require('../db/db_util')
var mysql = require('mysql')
var logger = require('../util/log').logger('model_user')

exports.insert = function (args, cb) {
    var sql = 'insert into user_info(email,password,nickname,photo) values(?,?,?,?);'
    var inserts = [args.email, args.password, args.nickname, '/images/default-avatar.jpg']
    sql = mysql.format(sql, inserts)
    logger.info("sql:" + sql)
    
    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.login = function (args, cb) {
    var sql = 'select * from user_info where email = ? and password = ?;'
    var inserts = [args.email, args.password]
    sql = mysql.format(sql, inserts)
    logger.info("sql:" + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

exports.update = function (args, cb) {
    var sql = 'update user_info set email = ? , nickname = ?, sex = ? ,birthday = ?, \
        city = ?, hometown = ?, school = ?, intro = ? where id = ?'
    var inserts = [args.email, args.nickname, args.sex, args.birthday, args.city, 
        args.hometown, args.school, args.intro, args.id]
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
    var sql = 'select id, email, nickname, sex, birthday, city, hometown, school, photo, intro from user_info where id = ?;'
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

exports.get_user_intro = function (args, cb) {
    var sql = 'select id, nickname, photo, sex, city, intro from user_info where id = ?;\
               select id, title, content, post_time from blog where user_id = ? order by post_time desc limit 2;\
               select id, cover, album_name from album where user_id = ? limit 4;\
               select id, content, post_time from broadcast where user_id = ? order by post_time limit 5;\
               select m.id,u.nickname,u.id,u.photo,m.content,m.post_time from message m \
               inner join user_info u on m.user_id = u.id where user_id = ? order by post_time limit 5;'
    var inserts = [args.user_id, args.user_id, args.user_id, args.user_id, args.user_id]
    sql = mysql.format(sql, inserts)
    logger.info('sql:' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, results) {
            cb(err, results)
            conn.release()
        })
    })
}

exports.check_nickname = function (args, cb) {
    var sql = 'select id from user_info where nickname = ?;'
    var inserts = [args.nickname]
    sql = mysql.format(sql, inserts)
    logger.info('sql:' + sql)

    db.get_connection(function (conn) {
        conn.query(sql, function (err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}