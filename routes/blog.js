var router = require('express').Router(),
    logger = require('../util/log').logger('routes_blog'),
    model_blog = require('../model/blog'),
    model_category = require('../model/category'),
    moment = require('moment'),
    model_feed = require('../model/feed'),
    snippet = require('../util/snippet')

var to_post_blog = function (req, res) {
    var user_id = req.session.user_id
    model_category.list({user_id: user_id}, function (err, rows) {
        res.render('blog/add_blog', {category_list: rows})
    })
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

    var args1 = {
        'user_id' : user_id,
        'category_id' : category_id,
        'title' : title,
        'content' : content
    }

    model_blog.insert(args1, function (err, rows) {
        if (err) {
            return res.render('error.jade', err)
        }
        var event_msg = {
            nickname  : req.session.current_user.nickname,
            photo     : req.session.current_user.photo,
            action    : '发布了blog',
            url_id    : rows.insertId,
            content   : title
        }

        var args2 = {
            user_id  : req.session.user_id,
            msg_type : model_feed.msg_type.add_friend,
            event_msg: JSON.stringify(event_msg)
        }
        model_feed.insert(args2, function (error, results) {
            if (error) {
                logger.error('generate feed failed , blog_id :' + rows.insertId)
                return res.redirect('back')
            }

            res.redirect('/' + req.session.user_id + '/blog/' + rows.insertId)
        })
        
    })    
}

var get_list_by_user = function (req, res) {
    var user_id = res.locals.user_profile.id
    
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
            rows[i].post_time = moment(rows[i].post_time).format('YYYY-MM-DD HH:mm')
            rows[i].content = snippet.snip(rows[i].content, 200) + '...'
        }

        res.render('blog/blog', {blog_list : rows})
    })
}

var get_blog_detail = function (req, res) {
    var id = req.params.id

    if (id === undefined) {
        return res.redirect('back')
    }

    var args = {
        'id'        : id,
        'type'      : 0,
        'review_id' : id
    }
    model_blog.get_by_id(args, function (err, rows) {
        if (err) {
            logger.error('get blog detail failed . blog_id: ' + id)
            return res.render('error.jade', err)
        }
        
        var post_time = moment(rows[0][0].post_time).format('YYYY-MM-DD HH:mm')
        rows[0][0].post_time = post_time

        var length = rows[1].length
        for (var i = 0 ; i < length ; i++) {
            rows[1][i].review_time = moment(rows[1][i].review_time).format('YYYY-MM-DD HH:mm')
        }
        return res.render('blog/blog_detail', {blog_detail : rows[0][0], reviews: rows[1]})
    })
}

var update_blog = function (req, res) {
    var id = req.body.id
    var category_id = req.body.category_id
    var title = req.body.title
    var content = req.body.blog_content

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
        return res.redirect('/' + req.session.user_id + '/blog/' + id)
    })


}

var del_blog = function (req, res) {
    var id = req.param('id')
    if (id === undefined) {
        return res.redirect('back')
    } 

    var args = {id: id}
    model_blog.del(args, function (err, rows) {
        if (err) {
            logger.error('delete blog failed, blog id : ' + args.id)
            return res.render('error', err)
        }

        return res.redirect('/' + req.session.user_id + '/blog_list')
    })
}

var to_update_blog = function (req, res) {
    var id = req.param('id')
    if (id === undefined) {
        return res.redirect('back')
    }

    model_blog.get_by_id({id: id}, function (err, rows) {
        if (err) {
            return res.render('error', err)
        }
        model_category.list({user_id: req.session.user_id}, function (err, result) {
            if (err) {
                return res.render('error', err)
            }
            
            return res.render('blog/update_blog', {blog_detail: rows[0][0], category_list: result})
        })
    })
}

var add_category = function (req, res) {
    var user_id = req.session.user_id
    var category_name = req.param('category_name')

    if (user_id === undefined || category_name === undefined) {
        return res.send({ok: 0})
    }

    var args = {user_id: user_id, category_name: category_name}

    model_category.insert(args, function (err, rows) {
        if (err) {
            logger.error("insert category failed , category_name :" + category_name)
            return res.send({ok: 0})
        }
        return res.send({id: rows.insertId})
    })
}

var update_category = function (req, res) {
    var id = req.body.id
    var category_name = req.body.category_name

    if (id === undefined || category_name === undefined) {
        return res.send({ok: 0})
    }
    var args = {id: id, category_name: category_name}
 
    model_category.update(args, function (err, rows) {
        if (err) {
            return res.send({ok: 0})
        }
        return res.send(rows)
    })
}

var del_category = function (req, res) {
    var id = req.body.id
    if (id === undefined) {
        return res.send({ok: 0})
    }

    model_category.del({id: id}, function (err, rows) {
        if (err) {
            return res.send({ok: 0})
        }
        return res.send(rows)
    })
}

var list_category = function (req, res) {
    var user_id = res.locals.user_profile.id

    if (user_id === undefined) {
        return res.send({ok: 0})
    }

    model_category.list({user_id: user_id}, function (err, rows) {
        if (err) {
            return res.send({ok: 0})
        }

        return res.send(rows)
    })
}

var get_blog_list_by_category = function (req, res) {
    var category_id = req.param('category_id')

    if (category_id === undefined) {
        return res.redirect('back')
    }

    model_blog.get_list_by_category({category_id: category_id}, function (err, rows) {
        if (err) {
            return res.redirect('back')
        }

        for (var i in rows) {
            rows[i].post_time = moment(rows[i].post_time).format('YYYY-MM-DD HH:mm')
        }
        return res.render('blog/blog', {blog_list : rows})
    })
}

var get_blog_by_title = function (req, res) {
    var title = req.param('title')
    var user_id = res.locals.user_profile.id
    if (title === undefined) {
        return res.redirect('back')
    }

    model_blog.get_blog_by_title({title: title, user_id: user_id}, function (err, rows) {
        if (err) {
            return res.redirect('back')
        }

        for (var i in rows) {
            rows[i].post_time = moment(rows[i].post_time).format('YYYY-MM-DD HH:mm')
            rows[i].content = snippet.snip(rows[i].content, 200) + '...'
        }

        return res.render('blog/blog', {blog_list: rows})
    })
}

router.get('/to_update_blog', to_update_blog)
router.post('/update_blog', update_blog)
router.get('/del_blog', del_blog)
router.get('/add_blog', to_post_blog)
router.post('/post_blog', post_blog)
router.get('/blog/:id', get_blog_detail)
router.get('/blog_list', get_list_by_user)
router.post('/add_category', add_category)
router.get('/update_category', update_category)
router.post('/del_category', del_category)
router.get('/list_category', list_category)
router.get('/category/:category_id', get_blog_list_by_category)
router.post('/search_blog', get_blog_by_title)

module.exports = router