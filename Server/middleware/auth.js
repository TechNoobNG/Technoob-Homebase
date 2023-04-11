let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let bcrypt = require('bcryptjs');
let crypto = require('crypto');


const authenticateMiddleware = passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
});

const googleAuthenticateMiddleware = passport.authenticate('google', {
    scope: ['profile', 'email']
});

const googleCallbackAuthenticateMiddleware = passport.authenticate('google', {
    failureRedirect: '/authenticate/login',

});

const githubAuthenticateMiddleware = passport.authenticate('github', {
    scope: ['read:user', 'user:email', "user:follow"]
});

const githubCallbackAuthenticateMiddleware = passport.authenticate('github', {
    failureRedirect: 'auth/failed',

});

module.exports = {
    authenticateMiddleware,
    googleCallbackAuthenticateMiddleware,
    googleAuthenticateMiddleware,
    githubAuthenticateMiddleware,
    githubCallbackAuthenticateMiddleware

};