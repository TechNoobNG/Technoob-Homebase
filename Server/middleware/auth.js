
const mongoose = require('mongoose');
const Admin = require('../models/admin');
const Permissions = require('../models/permissions');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[env];
const passport = require('../config/passportConfig')



const authenticateMiddleware = passport.authenticate('local', {
    failureMessage: 'Invalid username or password',
    failureRedirect: '/authenticate/login',
})

const googleAuthenticateMiddleware = passport.authenticate('google', {
    scope: ['profile', 'email']
});

const googleCallbackAuthenticateMiddleware = passport.authenticate('google', {
    failureRedirect: '/authenticate/login',

});

const githubAuthenticateMiddleware = passport.authenticate('github', {
    scope: ['read:user', 'user:email', "user:follow"],
    successFlash: 'Welcome!',
});

const githubCallbackAuthenticateMiddleware = passport.authenticate('github', {
    failureRedirect: 'auth/failed',
    successFlash: 'Welcome dev!',

});

module.exports = {
    authenticateMiddleware,
    googleCallbackAuthenticateMiddleware,
    googleAuthenticateMiddleware,
    githubAuthenticateMiddleware,
    githubCallbackAuthenticateMiddleware,
    isAuthenticated(req, res, next) {
        try {
            const token = req.headers["authorization"]?.split(' ')[1];
            if (req.isAuthenticated()) {
                return next();
            } else if(token){
                passport.authenticate('authenticate', { session: false }, (err, user) => {
                    if (err || !user) {
                        throw new Error("Unauthorized access");
                    }

                    req.user = user;
                    return next();
                })(req, res, next);
            } else {
                throw new Error("Unauthorized access")
            }
        } catch (err) {
            res.isAuthenticated = false;
            res.status(401).json({
                status: 'fail',
                message: 'Unauthorized access'
            })
        }
    },

    isAdmin(req, res, next) {
        if ( req.user?.role === 'admin') {
            return next();
        }
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized access'
        })
    },
    hasPermission(perm) {
        return async (req, res, next) => {
            try {
                const permission = await Permissions.findOne({ permission: perm });
                const permissionId = permission ? new mongoose.Types.ObjectId(permission._id) : null;
                if (!permissionId) {
                    throw new Error('Permission not found')
                }
                const admin = await Admin.findOne({ user_id: req.user?._id, permissions: { $in: [permissionId] } });

                if (!admin || !admin.isActive) {
                    return res.status(401).json({
                        status: 'fail',
                        message: 'You do not have permission to access this resource'
                    })
                }

                next();
            } catch (err) {
                console.log(err)
                return res.status(401).json({
                    status: 'fail',
                    message: 'You do not have permission to access this resource'
                })
            }
        };
    }

};