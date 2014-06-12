var router = require('express').Router(),
    logger = require('../util/log').logger('routes_message'),
    model_message = require('../model/message'),
    moment = require('moment')

var post_message = function (req, res) {
    var user_id = req.param('user_id'),
        poster_id = req.session.user_id,
        content = req.param('content')

    if (user_id === undefined || poster_id === undefined || content === undefined) {
        return res.redirect('back')
    }

    var args = {
        user_id   : user_id,
        poster_id : poster_id,
        content   : content
    }

    model_message.insert(args, function (err, rows) {
        if (err) {
            logger.error('insert message failed. poster_id :' + poster_id)
            return res.redirect('back')
        }

        return res.redirect('/' + user_id + '/message_list')
    })
}

var del_message = function (req, res) {

}

var list_message = function (req, res) {
    var user_id = res.locals.user_profile.id
    if (user_id === undefined) {
        return res.redirect('back')
    }

    model_message.list({user_id: user_id}, function (err, rows) {
        if (err) {
            logger.error('list messages failed. user_id :' + user_id)
            return res.redirect('back')
        }

        var length = rows.length
        for (var i = 0 ; i < length ; i++) {
            rows[i].post_time = moment(rows[i].post_time).format('YYYY-MM-DD HH:mm')
        }

        return res.render('message/message', {message_list: rows})
    })
}
router.post('/post_message', post_message)
router.get('/message_list', list_message)
module.exports = router