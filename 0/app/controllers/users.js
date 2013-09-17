/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
	UserEntrices = {},
	passport = null;

module.exports = function(ps) {
	if(!ps)throw new Error('passport must be set');
	passport=ps;
	return UserEntrices;
}

function defineRequestMethod (handlers){
	var req,res,next;
	function badRequest (msg) {
		var err={message:msg,status:'Bad Request'};
		if (req.acceptType('json')) {
			console.log(err);
			res.json(400,err);	
		} else {
			res.render('400',err);
		}
	}

	function filterHandlers (callback) {
		handlers.forEach(function(handler) {
			if (handler.method){
				if (!req.method.toLowerCase().match(handler.method)){
					badRequest('Request method must be '+handler.method);
				}
			}
		
			if (handler.type) {
				if (!req.acceptType(handler.type)) {
					badRequest('Response type only support '+handler.type);
				}
			}
		

			callback( handler.handle);
		});

	}
	return function(rq, rs, nxt) {
		req=rq,res=rs,next=nxt;
		filterHandlers(function(handle) {
			if (handle) {
				handle(req, res, next);
			}else{
				next();
			}	
		});
		
	}
}

/**
 * Auth callback
 */
UserEntrices.authCallback = function(req, res, next) {
	res.redirect('/');
};

/**
 * Show login form
 */
UserEntrices.signin = function(passport) {
	var handle = function(req,res,next) {
		 passport.authenticate('local',function(err, user, info) {
			if (err) {
				return res.json(400,err);
			};
			if (!user) {
				return res.json(400,info);
			}
            console.log(req.user);
            req.login(user, function(err) {
                if(err)next(err); 
                return res.json(user)
            });
		})(req,res,next);
	}

	return defineRequestMethod([
			{
				method: 'post',
				type: 'json',
				handle: handle
			}
		]);
}

;

/**
 * Show sign up form
 */
UserEntrices.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
UserEntrices.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
UserEntrices.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
UserEntrices.create = function(req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/**
 *  Show profile
 */
UserEntrices.show = function(req, res) {
    var user = req.profile;

    res.render('users/show', {
        title: user.name,
        user: user
    });
};

/**
 * Send User
 */
UserEntrices.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
UserEntrices.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};
