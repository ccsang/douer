var express = require('express')
var router = express.Router()
var model_user = require('../model/user')
var logger = require('../util/log').logger('routes_users')
var crypto = require('../util/encryption')

/* GET users listing. */
// router.get('/', function (req, res) {
//     res.send('respond with a resource')
// })


router.get('/register', function (req, res) {
    res.render('sign_up')
})

router.get('/signup', function (req, res) {
    var email = req.param('email')
    var password = req.param('password')
    var nick_name = req.param('nick_name')

    logger.info(">>>>>>>>>>>>>>>>" + email + " " + password + " " + nick_name)
    if (email === undefined || password === undefined || nick_name === undefined) {
        return res.render("sign_up")
    }

    password = crypto.encrypt(password)

    var args = {'email': email, 'password': password, 'nick_name': nick_name}

    model_user.insert(args, function (rows) {
        logger.info("insert success!")
        return res.render("login")
    })

})

router.post('/signin', function (req, res) {
    var email = req.param('email')
    var password = req.param('password')
    // var email = req.body.email
    // var password = req.body.password

    logger.info(">>>>>>>>>>>>" + email + " " + password)
    if (email === undefined || password === undefined) {
        return res.render("login")
    }

    password = crypto.encrypt(password)
    var args = {'email': email, 'password': password}

    model_user.login(args, function (rows) {
        if (rows[0] === undefined) {
            return res.render("login", {msg: '用户名/密码错误'})
        }
        return res.render('index', {user: rows[0]})
    })
})

module.exports = router
