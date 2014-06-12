var router = require('express').Router(),
    logger = require('../util/log').logger('routes_friends'),
    model_friends = require('../model/friends'),
    model_group = require('../model/friends_group'),
    model_add_msg = require('../model/add_friend_msg'),
    model_feed = require('../model/feed')

var add_friends = function (req, res) {
    var user_id = res.locals.user_profile.id
    var id = req.param('id')
    var nickname = req.param('nickname')
    var photo = req.param('photo')

    if (user_id === undefined || id === undefined) {
        return res.send({ok: 0})
    }

    var args1 = {
        user_id   : user_id,
        friend_id : id 
    }

    var args2 = {
        status       : 0,
        user_id      : id,
        send_user_id : user_id
    }
    model_friends.insert(args1, function (err, results) {
        if (err) {
            logger.error('add friends failed. user_id :' + user_id)
            return res.send({ok: 0})
        }
        
        model_add_msg.update(args2, function (err, rows) {
            if (err) {
                logger.error('update add_friend_msg failed. id:' + args2.id)
                return res.send({ok: 0})
            }
            var event_msg1 = {
                nickname  : req.session.current_user.nickname,
                photo     : req.session.current_user.photo,
                action    : '加了好友',
                url_id    : id,
                content   : nickname
            }

            var args3 = {
                user_id  : req.session.user_id,
                msg_type : model_feed.msg_type.add_friend,
                event_msg: JSON.stringify(event_msg1)
            }
            model_feed.insert(args3, function (error, feed1) {
                if (error) {
                    logger.error('generate feed failed , user__id :' + req.session.user_id)
                    return res.redirect('back')
                }

                var event_msg2 = {
                    nickname  : nickname,
                    photo     : photo,
                    action    : '加了好友',
                    url_id    : req.session.user_id,
                    content   : req.session.current_user.nickname
                }

                var args4 = {
                    user_id  : id,
                    msg_type : model_feed.msg_type.add_friend,
                    event_msg: JSON.stringify(event_msg2)
                }
                model_feed.insert(args4, function (error, feed1) {
                    if (error) {
                        logger.error('generate feed failed , user__id :' + res.locals.user_profile.id)
                        return res.redirect('back')
                    }

                    return res.send({ok: 1})
                })

            })
        })
    })


}

var add_friend_req = function (req, res) {
    var user_id = req.session.user_id
    var id = req.param('id')
    var content = req.param('content')

    if (user_id === undefined || id === undefined || content === undefined) {
        return res.send({ok: 0, error: 'param required'})
    }
    
    var args = {
        user_id: user_id,
        send_user_id: id,
        content: content
    }
    model_add_msg.insert(args, function (err, rows) {
        if (err) {
            logger.error('send add friends msg failed. id: ' + id)
            return res.send({ok: 0, error: 'add msg failed'})
        }

        return res.send({ok: 1})
    })

}

var get_friend_req = function (req, res) {
    var user_id = req.session.user_id

    if (user_id === undefined) {
        return res.redirect('/login')
    }

    model_add_msg.list({send_user_id: user_id}, function (err, rows) {
        if (err) {
            logger.error('get add friends msg failed. user_id : ' + user_id)
            return res.send({ok: 0})
        }

        return res.send(rows)
    })
}

var del_friends = function (req, res) {
    var friend_id = req.param('friend_id'),
        user_id = req.session.user_id

    if (friend_id === undefined || user_id === undefined) {
        return res.redirect('back')
    }

    var args = {
        friend_id: friend_id,
        user_id  : user_id
    }
    model_friends.delete(args, function (err, rows) {
        if (err) {
            logger.error('delete friends failed, user_id : ' + user_id)
            return res.redirect('back')
        }

        return res.redirect('back')
    })
}

var update_friends = function (req, res) {

}

var list_friends = function (req, res) {
    // var user_id = req.session.user_id
    var user_id = res.locals.user_profile.id
    if (user_id === undefined) {
        return res.redirect('back')
    }

    model_friends.list({user_id: user_id}, function (err, rows) {
        if (err) {
            logger.error('get friends list failed, user_id:' + user_id)
            return res.redirect('back')
        }

        return res.render('friend/friends', {friends_list: rows})
    })
}


var add_group = function (req, res) {

}

var update_group = function (req, res) {

}

var del_group = function (req, res) {

}

var list_group = function (req, res) {

}

router.post('/req_to_add_friends', add_friend_req)
router.post('/get_friend_req', get_friend_req)
router.post('/add_friends', add_friends)
router.get('/friends_list', list_friends)
router.post('/del_friends', del_friends)
module.exports = router