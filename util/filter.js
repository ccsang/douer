var logger = require('./log').logger('filter'),
model_user = require('../model/user')

exports.authorize = function (req, res, next) {
	console.log('wahaha -> ' + req.session.user_id)
    if (!req.session.user_id) {
		return res.redirect('/login')
	}

	next()
}

exports.check_cookie = function (req, res, next) {
    if (req.session.user_id !== undefined) {
        return next()
    }

    var email = req.cookies.email,
    password = req.cookies.password     

    logger.info('Checking cookie... email: ' + email + " password: " + password)
    if (email && password) {
        logger.info('Cookie exists')
        model_user.login({'email': email, 'password': password}, function (err, rows) {
            if (err) {
                logger.error('服务器错误')
                return res.render('login', {info: '服务器错误'})
            }
            
            if (rows[0] !== undefined) {
                req.session.user = rows[0]  
                req.session.user_id = rows[0].id
                
                logger.info('User exists, user_id :' + req.session.user_id)
		        // res.redirect('back')

            }
            else {
                logger.info('User not exists, redirect to login')
            }
            // res.redirect('/login')
        })

    }

    next(req, res)
}

exports.get_user_profile = function (req, res, next) {
    var id = req.param('id');
    logger.info("请叫我坑爹包！！！！！！！！！！！！" + req.path);
    model_user.get_by_id({id: id}, function (err, rows) {
        if (err) {
            logger.error('get user failed, id: ' + id)
            return res.redirect('back')
        };
        
        res.locals.user_profile = rows[0]
        next()
    }) 
}