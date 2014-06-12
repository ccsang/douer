var router = require('express').Router(),
    logger = require('../util/log').logger('routes_photo'),
    model_photo = require('../model/photo'),
    model_album = require('../model/album'),
    fs = require('fs'),
    formidable = require('formidable'),
    util = require('util'),
    moment = require('moment'),
    model_feed = require('../model/feed')


var list_albums = function (req, res) {
    var user_id = res.locals.user_profile.id
    if (user_id === undefined) {
        return res.redirect('back')
    }

    model_album.list({user_id: user_id}, function (err, rows) {
        if (err) {
            logger.error('get albums list failed. user_id : ' + user_id)
            return res.render('error.jade', err)
        }
        return res.render('photo/album', {album_list: rows})
    }) 
}

var list_photos = function (req, res) {
    var user_id = res.locals.user_profile.id
    var album_id = req.param('album_id')
    if (user_id === undefined || album_id === undefined) {
        return res.redirect('back')
    }

    var args = {
        user_id : user_id,
        album_id : album_id
    }
    
    model_album.get_by_id({id: album_id}, function (err, result) {
        if (err) {
            logger.error('get album by id failed , album_id :' + album_id)
            return res.redirect('back')
        }

        model_photo.get_list_by_album(args, function (err, rows) {
            if (err) {
                logger.error('get photos failed. albun_id : ' + album_id)
                return res.render('error.jade', err)
            }
            return res.render('photo/photo', {photo_list: rows, album: result[0]})
        })
    })
}

var add_album = function (req, res) {
    var user_id = req.session.user_id
    var album_name = req.param('album_name')

    if (user_id === undefined || album_name === undefined) {
        return res.redirect('back')
    }
    
    var args = {user_id: user_id, album_name: album_name}
    model_album.insert(args, function (err, rows) {
        if (err) {
            logger.error('add album failed. user_id : ' + user_id)
            return res.render('error.jade', err)
        }
        return res.redirect('/' + user_id + '/album_list')
    })
}
var update_album = function (req, res) {
    var user_id = req.session.user_id
    var album_id = req.param('album_id')
    var album_name = req.param('album_name')
    var cover = req.param('cover')

    logger.info("album_id >>>>>>>>>" + album_id)
    if (user_id === undefined || album_name === undefined || 
        cover === undefined || album_id === undefined) {
        return res.redirect('back')
    }

    var args = {user_id: user_id, id: album_id, album_name: album_name, cover: cover}
    model_album.update(args, function (err, rows) {
        if (err) {
            logger.error('update album failed. album_id :' + album_id)
            return res.render('error.jade', err)
        }

        return res.redirect('/' + user_id + '/album_list')
    })
}
var del_album = function (req, res) {
    var user_id = req.session.user_id
    var album_id = req.param('album_id')

    if (user_id === undefined || album_id === undefined) {
        return res.redirect('back')
    }

    var args = {id: album_id, user_id: user_id}
    model_album.del(args, function (err, rows) {
        if (err) {
            logger.error('del album failed, id :' + album_id)
            return res.redirect('back')
        }

        model_photo.del_by_album({album_id: album_id, user_id: user_id}, function (err, rows) {
            if (err) {
                logger.error('del album failed, id: ' + album_id)
                return res.redirect('back')
            }

            return res.redirect('/' + user_id + '/album_list')
        })
    })
}

var upload_photo = function (req, res) {
    var user_id = req.session.user_id
    var form = new formidable.IncomingForm()
    form.uploadDir = './public/uploads/'
    form.parse(req, function (err, fields, files) {
        if (err) {
            logger.error(util.inspect(err))
            return res.redirect('back')
        }

        var comment = fields.comment
        var album_id = fields.album_id
        logger.info("user_id >>> " + user_id + " comment >>>" + comment + " album_id >>> " + album_id)

        var tmp_path = files.photo.path
        var photo_name = files.photo.name
        var suffix = photo_name.substring(photo_name.lastIndexOf('.'))
        var now = new Date()
        var folder = '/images/' + now.getFullYear() + now.getMonth() + '/'
        var target_folder = './public' + folder
        
        if (!fs.existsSync(target_folder)) {
            fs.mkdirSync(target_folder)
        } 
        
        var path = folder + user_id + Date.parse(new Date()) + Math.random(10000) + now.getMilliseconds() + suffix    
        var target_path = './public' + path
        
        var args1 = {
            user_id  : user_id,
            comment  : comment,
            album_id : album_id,
            path     : path
        }
        model_photo.insert(args1, function (err, rows) {
            if (err) {
                logger.error('insert into photo failed, user_id :' + user_id)
                return res.redirect('back')
            }
            fs.rename(tmp_path, target_path, function (err) {
                if (err) {
                    logger.error(util.inspect(err))
                }

                fs.unlink(tmp_path, function () {
                    if (err) {
                        throw err
                    }
                    var event_msg = {
                        nickname  : req.session.current_user.nickname,
                        photo     : req.session.current_user.photo,
                        action    : '上传了图片',
                        url_id    : rows.insertId,
                        content   : path
                    }

                    var args2 = {
                        user_id  : req.session.user_id,
                        msg_type : model_feed.msg_type.photo,
                        event_msg: JSON.stringify(event_msg)
                    }
                    model_feed.insert(args2, function (error, results) {
                        if (error) {
                            logger.error('generate feed failed , photo_id :' + rows.insertId)
                            return res.redirect('back')
                        }

                        res.redirect('/' + req.session.user_id + '/photo/' + rows.insertId)
                    })
                })
            })
        })
    })
}

var get_photo_by_id = function (req, res) {
    var id = req.param('id')

    if (id === undefined) {
        return res.redirect('back')
    }

    var args = {
        id        : id,
        review_id : id,
        type      : 1
    }
    model_photo.get_by_id(args, function (err, rows) {
        if (err) {
            logger.error('get photo failed, id: ' + id)
            return res.redirect('back')
        }

        var length = rows[1].length
        for (var i = 0 ; i < length ; i++) {
            rows[1][i].review_time = moment(rows[1][i].review_time).format('YYYY-MM-DD HH:mm')
            // rows[1][i].review_time = moment(rows[1][i].review_time).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm')
        }

        return res.render('photo/photo_detail', {photo_detail: rows[0][0], reviews: rows[1]})
    })
}

router.get('/album_list', list_albums)
router.post('/upload_photo', upload_photo)
router.post('/add_album', add_album)
router.get('/album/:album_id', list_photos)
router.get('/photo/:id', get_photo_by_id)
router.post('/del_album', del_album)
router.post('/update_album', update_album)
module.exports = router

