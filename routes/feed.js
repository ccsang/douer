var router = require('express').Router(),
    logger = require('../util/log').logger('routes_feed'),
    model_feed = require('../model/feed'),
    formidable = require('formidable'),
    util = require('util'),
    moment = require('moment')

var get_feed = function (req, res) {
    var user_id = req.session.user_id

    model_feed.list({user_id : user_id}, function (err, rows) {
        if (err) {
            logger.error('get feed failed, user_id:' + user_id)
            return res.redirect('back')
        }
        
        var length = rows.length
        for (var i = 0 ; i < length ; i++) {
            rows[i].event_msg = JSON.parse(rows[i].event_msg)
            rows[i].create_time = moment(rows[i].create_time).format('YYYY-MM-DD HH:mm')
        }

        res.render('feed/feed', {feeds: rows})
    })
}

router.get('/feed', get_feed)

module.exports = router

