var router = require('express').Router(),
    logger = require('../util/log').logger('routes_photo'),
    model_photo = require('../model/photo'),
    model_album = require('../model/album'),
    fs = require('fs'),
    formidable = require('formidable'),
    util = require('util'),
    crypto = require('crypto')

var to_post_photo = function (req, res) {
    var user_id = req.session.user_id

}

var list_albums = function (req, res) {
    var user_id = req.session.user_id
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
    var user_id = req.session.user_id
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
            return res.render('back')
        }
        for (var i in result[0]) {
            logger.info(i +" >>> " + result[0][i])
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
        return res.redirect('/album_list')
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
        var now = new Date()
        var folder = '/images/' + now.getFullYear() + now.getMonth() + '/'
        var target_folder = './public' + folder
        
        if (!fs.existsSync(target_folder)) {
            fs.mkdirSync(target_folder)
        } 
        
        var path = folder + user_id + Date.parse(new Date()) + Math.random(100) + files.photo.name    
        var target_path = './public' + path
        
        var args = {
            user_id  : user_id,
            comment  : comment,
            album_id : album_id,
            path     : path
        }
        model_photo.insert(args, function (err, rows) {
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
                    res.redirect('back')
                })
            })
        })
    })
}

router.get('/album_list', list_albums)
router.post('/upload_photo', upload_photo)
router.post('/add_album', add_album)
router.get('/album/:album_id', list_photos)
module.exports = router
