var router = require('express').Router(),
    logger = require('../util/log').logger('routes_message'),
    model_short_messages = require('../model/short_messages'),
    moment = require('moment'),
    util = require('util'),
    moment = require('moment'),
    model_user = require('../model/user')

var post_short_messages = function (req, res) {
    var send_user_id = req.session.user_id,
        receive_user_id = req.param('receive_user_id'),
        content = req.param('content')


    if (send_user_id === undefined || receive_user_id === undefined || content === undefined) {
        return res.redirect('back')
    }
    
    var args = {
        send_user_id: send_user_id,
        receive_user_id: receive_user_id,
        content: content
    }
    model_short_messages.insert(args, function (err, rows) {
        if (err) {
            logger.error(util.inspect(err))
            return res.redirect('back')
        }

        res.redirect('/' + req.session.user_id + '/list_short_messages')
    })

}

var list_short_messages = function (req, res) {
    var receive_user_id = req.session.user_id

    if (receive_user_id === undefined) {
        return res.redirect('back')
    }

    var args = {
        receive_user_id: receive_user_id
    }

    model_short_messages.list(args, function (err, rows) {
        if (err) {
            logger.error(util.inspect(err))
            return res.redirect('back')
        }
        var length = rows.length
        for (var i = 0 ; i < length ; i++) {
            rows[i].send_time = moment(rows[i].send_time).format('YYYY-MM-DD HH:mm')
        }
        res.render('short_messages/short_message', {short_messages_list: rows})
    })

}

var list_conversation = function (req, res) {
    var receive_user_id = req.session.user_id

    if (receive_user_id === undefined) {
        return res.redirect('back')
    }

    var args = {
        receive_user_id: receive_user_id
    }

    model_short_messages.list_conversation(args, function (err, rows) {
        if (err) {
            logger.error(util.inspect(err))
            return res.redirect('back')
        }

        res.render('short_messages/conversation', {conversations: rows})
    })
}

var to_write_message = function (req, res) {
    var receive_user_id = req.param('receive_user_id')
    var send_user_id = req.session.user_id

    if (receive_user_id === undefined || send_user_id === undefined) {
        return res.redirect('back')
    } 

    model_user.get_by_id({id: receive_user_id}, function (err, rows) {
        if (err) {
            logger.error(util.inspect(err))
            return res.redirect('back')
        }

        res.render('short_messages/write_short_message', {receive_user: rows[0]})
    })
}

// var update_status = function (req, res) {
//     var id = req.param('id')

//     if (id === undefined) {
//         return res.redirect('back')
//     }

//     var args = {
//         id : id
//     }

//     model_short_messages.update(args, function (err, rows) {
//         if (err) {
//             logger.error(util.inspect(err))
//             return res.redirect('back')
//         }

//         return res.render
//     })
// }

router.get('/list_conversation', list_conversation)
router.get('/list_short_messages', list_short_messages)
router.post('/post_short_messages', post_short_messages)
router.get('/write_message', to_write_message)
module.exports = router