var router = require('express').Router(),
    logger = require('../util/log').logger('routes_photo'),
    util = require('util'),
    model_review = require('../model/review'),
    moment = require('moment')

var reply = function (req, res) {
    
    var user_id   = req.session.user_id,
        type      = req.param('type'),
        review_id = req.param('review_id'),
        content   = req.param('content')

    if (user_id === undefined || type === undefined || review_id === undefined || content === undefined) {
        return res.redirect('back')
    }
    
    var args = {
        user_id   : user_id,
        type      : type,
        review_id : review_id,
        content   : content
    }
    model_review.insert(args, function (err, rows) {
        if (err) {
            logger.error('insert reply failed. review_id :' + rows.insertId)
        }

        res.redirect('back')
    })

}

var del_reply = function (req, res) {

    var user_id = req.session.user_id,
        reply_id = req.param('reply_id')

    if (user_id === undefined || reply_id === undefined) {
        return res.redirect('back')             
    }

    model_review.del({reply_id: reply_id}, function (err, rows) {
        if (err) {
            logger.error('delete reply failed. reply_id:' + reply_id)
        }

        return res.redirect('back')
    })
}

var get_reply_list = function (req, res) {
    var user_id = req.session.user_id,
        review_id = req.param('review_id'),
        type = req.param('type')

    if (user_id === undefined || review_id === undefined || type === undefined) {
        return res.send({ok: 0})
    }

    var args = {
        review_id : review_id,
        type     : type
    }
    model_review.list(args, function (err, rows) {
        if (err) {
            logger.error('get reply_list failed. reply_id:' + review_id)
            return res.send({ok: 0})
        }

        var length = rows.length
        for (var i = 0 ; i < length ; i++) {
            rows[i].review_time = moment(rows[i].review_time).format('YYYY-MM-DD HH:mm')
        }

        return res.send(rows)
    })
}


router.post('/reply', reply)
router.post('/list_reply', get_reply_list)

module.exports = router

