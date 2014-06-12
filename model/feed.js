var db = require('../db/db_util'),
    mysql = require('mysql'),
    logger = require('../util/log').logger('model_feed')

exports.insert = function (args, cb) {
    var sql = 'insert into feed(user_id, msg_type,event_msg) values(?,?,?);'
    var inserts = [args.user_id, args.msg_type, args.event_msg]
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
    var inserts = 
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
    var sql = ''
    var inserts = 
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
    var sql = 'select distinct feed.id,feed.user_id,feed.msg_type,feed.event_msg,feed.create_time \
               from feed inner join  friends on feed.user_id = friends.friend_id where feed.user_id in \
               (select friend_id from friends where user_id =?);'
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

exports.msg_type = {
    blog       : 0,
    add_friend : 1,
    photo      : 2,
    broadcast  : 3
}


