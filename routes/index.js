var express = require('express'),
    router = express.Router()
    // model_user = require('./model/user')

    /* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});



module.exports = router
