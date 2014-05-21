var router = require('express').Router(),
    logger = require('../util/log').logger('routes_blog'),
    model_blog = require('../model/blog'),
    moment = require('moment-timezone')

var to_post_blog = function (req, res) {
    res.render('add_blog')
}

var post_blog = function (req, res) {
    var user_id = req.session.user_id,
        category_id = req.body.category_id,
        title = req.body.title,
        content = req.body.blog_content
    logger.info('user_id :' + user_id + 'category_id : ' + category_id + 'title : ' + title + 'content' + content)

    if (user_id === undefined || category_id === undefined || 
        title === undefined || content === undefined) {
        return res.redirect('back')
    }
    var args = {
        'user_id' : user_id,
        'category_id' : category_id,
        'title' : title,
        'content' : content
    }

    model_blog.insert(args, function (err, rows) {
        if (err) {
            return res.render('error.jade', err)
        }
        
        res.redirect('/blog/' + rows.insertId)
    })    
}

var get_list_by_user = function (req, res) {
    var user_id = req.params.user_id
    
    logger.info(">>>>>>>>>>>" + user_id)
    if (user_id === undefined) {
        return res.redirect('back')
    }

    var args = {'user_id' : user_id}
    model_blog.get_list_by_user(args, function (err, rows) {
        if (err) {
            logger.error('get blog list failed. user_id :' + user_id)
            return res.render('error.jade', err)
        }
        
        for (var i in rows) {
            rows[i].post_time = moment.tz(rows[i].post_time, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm')
        }

        res.render('blog', {blog_list : rows})
    })
}

var get_blog_detail = function (req, res) {
    var id = req.params.id

    if (id === undefined) {
        return res.redirect('back')
    }

    var args = {'id' : id}
    model_blog.get_by_id(args, function (err, rows) {
        if (err) {
            logger.error('get blog detail failed . blog_id: ' + id)
            return res.render('error.jade', err)
        }
        
        var post_time = moment.tz(rows[0].post_time, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm')
        rows[0].post_time = post_time
        return res.render('blog_detail', {blog_detail : rows[0]})
    })
}

var update_blog = function (req, res) {
    var id = req.body.id
    var category_id = req.body.category_id
    var title = req.body.title
    var content = req.body.blog_content

    logger.info(">>>>>>>>>>>>>>>" + id + "  " + category_id + " " + title + " " + content)
    if (id === undefined || category_id === undefined ||
        title === undefined || content === undefined) {
        return res.redirect('back')
    }
    
    var args = {
        id          : id,
        category_id : category_id,
        title       : title,
        content     : content 
    }
    model_blog.update(args, function (err, rows) {
        if (err) {
            logger.error("update blog failed, blog id : " + args.id)
            return res.render('error', err)
        }
        
        // logger.info("insertId >>> " + id)
        return res.redirect('/blog/' + id)
    })


}

var del_blog = function (req, res) {
    var id = req.param('id')
    logger.info("id >>>>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + id)
    if (id === undefined) {
        return res.redirect('back')
    } 

    var args = {id: id}
    model_blog.del(args, function (err, rows) {
        if (err) {
            logger.error('delete blog failed, blog id : ' + args.id)
            return res.render('error', err)
        }

        return res.redirect('/blog_list/' + req.session.user_id)
    })
}

var to_update_blog = function (req, res) {
    var id = req.param('id')
    logger.info("id >>>> " + id)
    if (id === undefined) {
        return res.redirect('back')
    }

    model_blog.get_by_id({id: id}, function (err, rows) {
        if (err) {
            return res.render('error', err)
        }
        return res.render('update_blog', {blog_detail: rows[0]})
    })
}

router.get('/to_update_blog', to_update_blog)
router.post('/update_blog', update_blog)
router.get('/del_blog', del_blog)
router.get('/add_blog', to_post_blog)
router.post('/post_blog', post_blog)
router.get('/blog/:id', get_blog_detail)
router.get('/blog_list/:user_id', get_list_by_user)
module.exports = router