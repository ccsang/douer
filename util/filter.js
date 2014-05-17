var logger = require('./log').logger('filter'),
    model_user = require('../model/user')

exports.authorize = function (req, res, next) {
	if (!req.session.user_id) {
		return res.redirect('/login')
	}

	next()
}

exports.check_cookie = function (req, res, next) {
    var email = req.cookies.email,
        password = req.cookies.password     

    logger.info('Checking cookie... email: ' + email + " password: " + password)
	if (email && password) {
		model_user.login({'email': email, 'password': password}, function (rows) {
            if (rows[0] !== undefined) {
                req.session.user = rows[0]
		        req.session.user_id = rows[0].id
                
                logger.info('Cookie exists')
		        // return 
		        res.redirect('back')
		        return 
            }
            
            logger.info('Cookie not exists, redirect to login')
            return
            // return res.send({login : 0})
		})

	}

	next()
}