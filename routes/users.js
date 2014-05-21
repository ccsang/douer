var express = require('express')
var router = express.Router()
var model_user = require('../model/user')
var logger = require('../util/log').logger('routes_users')
var crypto = require('../util/encryption')
var filter = require('../util/filter')

/* GET users listing. */
// router.get('/', function (req, res) {
//     res.send('respond with a resource')
// })

var to_register = function (req, res) {
    res.render('sign_up')
}

var sign_up = function (req, res) {
    var email = req.param('email')
    var password = req.param('password')
    var nickname = req.param('nickname')

    logger.info(">>>>>>>>>>>>>>>>" + email + " " + password + " " + nickname)
    if (email === undefined || password === undefined || nickname === undefined) {
        return res.render("sign_up")
    }

    password = crypto.encrypt(password)

    var args = {'email': email, 'password': password, 'nickname': nickname}

    model_user.insert(args, function (rows) {
        logger.info("insert success!")
        return res.render("login")
    })    
}

var sign_in = function (req, res) {
    var email = req.param('email')
    var password = req.param('password')
    var is_remember = req.param('is_remember')
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
        
        req.session.current_user = rows[0]
        req.session.user_id = rows[0].id
        
        if (is_remember) {
            var cookie_opt = { domain: 'douer.com', path: '/', maxAge: 2592000000}
            res.cookie('email', email, cookie_opt)
            res.cookie('password', password, cookie_opt)
        }
        return res.render('index', {user_id : rows[0].id})
    })    
}

var log_out = function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            logger.error('cannot access session here.')
        }
        res.clearCookie('email')
        res.clearCookie('password')
        return res.redirect('login')
    })

}

var to_login = function (req, res) {
    res.render('login')
}

// var blog_list = function (req, res) {
//     res.render('blog')
// }

router.get('/register', to_register)

router.get('/signup', sign_up)

router.post('/signin', sign_in)

router.get('/logout', log_out)

router.get('/login', to_login)

// router.get('/blog', blog_list)

module.exports = router
