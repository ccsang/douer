var router = require('express').Router(),
    logger = require('../util/log').logger('routes_blog')

var to_post_blog = function (req, res) {
    res.render('add_blog')
}

router.get('/add_blog', to_post_blog)
module.exports = router