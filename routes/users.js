var express = require('express')
var router = express.Router()
var model_user = require('../model/user')
var logger = require('../util/log').logger('routes_users')
var crypto = require('../util/encryption')
var filter = require('../util/filter')
var formidable = require('formidable')
var util = require('util')
var fs = require('fs')
var snippet = require('../util/snippet')
var moment = require('moment')
var model_friends = require('../model/friends')

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

    var args1 = {'email': email, 'password': password, 'nickname': nickname}
    
    model_user.insert(args1, function (err1, rows) {
        logger.info(util.inspect(err1))
        if (err1) {
            logger.error("注册失败 : " + args1.email)
            return res.render('login', {info: '服务器错误'})
        }
        model_friends.insert_self({id: rows.insertId}, function (err2, results) {
            if (err2) {
                logger.error('insert self failed. user_id: ' + rows.insertId)
                return res.render('login', {info: '服务器错误'})
            }
            return res.render("login", {info: '注册成功'})
        }) 
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

    model_user.login(args, function (err, rows) {
        if (err) {
            return res.render("login", {info: '服务器错误'})
        }
        if (rows[0] === undefined) {
            return res.render("login", {info: '用户名/密码错误'})
        }
        
        req.session.current_user = rows[0]
        req.session.user_id = rows[0].id
        
        if (is_remember) {
            var cookie_opt = { domain: 'douer.com', path: '/', maxAge: 2592000000}
            res.cookie('email', email, cookie_opt)
            res.cookie('password', password, cookie_opt)
        }
        // return res.render('index', {profile: rows[0]})
        return res.redirect('/' + req.session.user_id)
    })    
}

var log_out = function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            logger.error('cannot access session here.')
        }
        res.clearCookie('email')
        res.clearCookie('password')
        return res.redirect('/login')
    })

}

var to_login = function (req, res) {
    res.render('login')
}

var update_profile = function (req, res) {
    var user_id = req.session.user_id
    var email = req.param('email')
    var nickname = req.param('nickname')
    var sex = req.param('sex')
    var birthday = req.param('birthday')
    var city = req.param('city')
    var hometown = req.param('hometown')
    var school = req.param('school')
    var intro = req.param('intro')

    if (user_id === undefined || email === undefined ||
        nickname === undefined || sex === undefined ||
        sex === undefined || birthday === undefined ||
        city === undefined || hometown === undefined ||
        school === undefined || intro === undefined) {
        return req.send({ok: 0})
    }
    
    var args = {
        id      : user_id,
        email   : email,
        nickname: nickname,
        sex     : sex,
        birthday: birthday,
        city    : city,
        hometown: hometown,
        school  : school,
        intro   : intro
    }
    model_user.update(args, function (err, rows) {
        
        if (err) {
            logger.info('update profile failed, user_id : ' + user_id)
            return res.send({ok: 0})
        }

        model_user.get_by_id({id: user_id}, function (err, rows) {
            if (err) {
                logger.info('get profile failed, user_id :' + user_id)
                return res.send({ok: 0})
            }

            req.session.current_user = rows[0]
            return res.redirect('/' + user_id + '/profile')
        })
    })

}

var update_avatar = function (req, res) {
    var user_id = req.session.user_id,
        photo = req.param('photo')
    
    var form = new formidable.IncomingForm()
    form.uploadDir = './public/uploads/'
    form.parse(req, function (err, fields, files) {
        if (err) {
            logger.error(util.inspect(err))
            return res.redirect('back')
        }

        var user_id = req.session.user_id,
            tmp_path = files.photo.path,
            photo_name = files.photo.name,
            suffix = photo_name.substring(photo_name.lastIndexOf('.')),
            now = new Date(),
            folder = '/images/avatar/',
            target_folder = './public' + folder

        if (user_id === undefined) {
            return res.redirect('back')
        }

        if (!fs.existsSync(target_folder)) {
            fs.mkdirSync(target_folder)
        }
    
        var path = folder + user_id + Date.parse(new Date()) + Math.random(1000000) + now.getMilliseconds() + suffix,
            target_path = './public' + path

        var args = {
            id: user_id,
            photo: path
        }

        fs.rename(tmp_path, target_path, function (err) {
            if (err) {
                logger.error(util.inspect(err))
                logger.error("target_path:" + target_path)
                return res.send({ok: 0})
            }

            fs.unlink(tmp_path, function () {
                if (err) {
                    logger.error(util.inspect(err))
                    return res.send({ok: 0})
                }
                model_user.update_avatar(args, function (err, rows) {
                    if (err) {
                        logger.info('update avatar failed, user_id:' + user_id)
                        return res.send({ok: 0})
                    }

                    model_user.get_by_id({id: user_id}, function (err, rows) {
                        if (err) {
                            logger.info('get profile failed, user_id :' + user_id)
                            return res.send({ok: 0})
                        }

                        req.session.current_user = rows[0]
                        return res.redirect('back')
                    })

                })
            })
        })
    })
}

var view_profile = function (req, res) {
    res.render('profile', {profile: req.session.current_user})
}

var search_by_nickname = function (req, res) {
    var user_id = req.session.user_id,
        nickname = req.param('nickname')

    if (user_id === undefined || nickname === undefined) {
        return res.redirect('back')
    }

    var args = {
        nickname : nickname
    }

    model_user.find_by_nickname(args, function (err, rows) {

        if (err) {
            logger.error('find user failed, nickname : ' + nickname)
            return res.redirect('back')
        }

        return res.render('search_result', {user_list: rows})
    })
}

var get_user_intro = function (req, res) {
    var user_id = req.param('id')

    if (user_id === undefined) {
        return res.redirect('back')
    }

    model_user.get_user_intro({user_id: user_id}, function (err, results) {
        if (err) {
            logger.error('get user intro failed, user_id: ' + user_id)
            return res.redirect('back')
        }

        var blos_list_length = results[1].length
        for (var i = 0 ; i < blos_list_length ; i++) {
            results[1][i].content = snippet.snip(results[1][i].content, 60) + '...'
            results[1][i].post_time = moment(results[1][i].post_time).format('YYYY-MM-DD HH:mm')
            
            
        }

        var broad_list_length = results[3].length
        for (var j = 0 ; j < broad_list_length; j++) {
            results[3][j].post_time = moment(results[3][j].post_time).format('YYYY-MM-DD HH:mm')
        }
        
        var message_list_length = results[3].length
        for (var k = 0 ; k < message_list_length; k++) {
            results[4][k].post_time = moment(results[4][k].post_time).format('YYYY-MM-DD HH:mm')
        }

        var result = {
            'user_profile'  : results[0][0],
            'user_blog'     : results[1],
            'user_album'    : results[2],
            'user_broadcast': results[3],
            'user_message'  : results[4]
        }

        return res.render('index', result)
    })

}

var index = function (req, res) {
    if (req.session.user_id === undefined) {
        return res.redirect('/login')
    }

    return res.redirect('/' + req.session.user_id)
}

var check_nickname = function (req, res) {
    var nickname = req.param('nickname')

    model_user.check_nickname({nickname: nickname}, function (err, rows) {
        if (err) {
            logger.error('check nickname failed, nickname: ' + nickname)
            return res.send({ok: 0})
        }

        if (rows[0] === undefined) {
            return res.send({ok: 1})    
        }
        else {
            return res.send({ok: 0})
        }
    })
}

router.get('/register', to_register)

router.post('/signup', sign_up)

router.post('/signin', sign_in)

router.get('/logout', log_out)

router.get('/login', to_login)

router.get('/:id/profile', view_profile)

router.post('/update_profile', update_profile)

router.post('/update_avatar', update_avatar)

router.post('/:id/search', search_by_nickname)

router.get('/:id', get_user_intro)
// router.get('/blog', blog_list)
router.get('/', index)

router.post('/check_nickname', check_nickname)

module.exports = router
