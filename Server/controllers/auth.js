
const env = process.env.NODE_ENV || 'development';
const config = require(`../config/config`)[env];
const User = require("../models/contact_us");
const passport = require('passport');
const services = require('../services/index');
const auth = services.auth;
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const baseurl = config.LIVE_BASE_URL;
const validator = require('../utils/joi_validator');

module.exports = {
    async login(req, res, next) {
        try {
            await validator.login.validateAsync(req.body);
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({
                        status: 'fail',
                        message: info.message
                    })
                }
                if (user) {
                    req.login(user,{ session: true }, async (err) => {
                        const token = jwt.sign({
                            user: {
                                _id: user._id,
                                username: user.username
                            }
                        }, config.JWT_SECRET, {
                            expiresIn: config.JWT_EXPIRES,
                            issuer: config.LIVE_BASE_URL,
                        });
    
                        return res.status(200).json({
                            status: 'success',
                            message: `Welcome to base, ${user.username}!`,
                            data: {
                                user
                            },
                            token
                        });
                    })                    
                } else {
                    return res.fail({
                        status: 'Failed',
                        message:  'Incorrect email or password.',
                        statusCode: 401
                    })
                }
            })(req, res, next);

        } catch (err) {
            return res.fail({
                status: 'Failed',
                message:  'Incorrect email or password.',
                statusCode: 401
            })
        }


    },

    async register(req, res, next) {
        try {
            await validator.register.validateAsync(req.body);

            await auth.register(req.body);
            req.body = {
                username: req.body.username,
                password: req.body.password
            }
            this.login(req, res, next);
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    logout(req, res) {
        req.logout((err) => {
            if (err) return next(err);
            req.session.destroy();
            res.setHeader("isAuthenticated", false).status(200).json({
                status: 'success',
                message: 'Logged out'
            })
        });
    },


    async verifyEmail(req, res) {
        const token = req.query.token
        try {
            const user = await auth.verifyUserEmail(token)
            if (!user) {
                const err = {
                    status: 401,
                    message: "Invalid token"
                }
                return res.render('error.jade', {err, title: "Error Page"});
            }
            // if (user.passwordResetAttempt > 3) {
            //     const err = {
            //         status: 401,
            //         message: "Max reset attempts reached, kindly attempt a new reset"
            //     }
            //     return res.render('error.jade', {err, title: "Error Page"});
            // }
            const render_payload = {
                title: "Email Verifcation" ,
                status: 'success',
                username: user.username,
                message: `Email Verified  Successfully`,
            }
            return res.render('email-verification.jade', { render_payload, title: "Verify Email"});
        } catch (err) {
            err.status = 500
            err.message = "Internal Service Error"
            if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
                err.message = "Invalid/Expired Token"
                err.status = 400
            }
            return res.render('error.jade', {err, title: "Error Page"});
        }
    },

    async forgotPasswordEmail(req,res) {
        const { email } = req.body
        try {
            const reset = await auth.forgotPasswordEmail(email)
            if(!reset) throw new Error("An error occured")
            res.status(200).json({
                status: 'success',
                message: `Email Sent`,
            })
        } catch (err) {
            res.fail({
                status: 'Failed',
                message: "User password reset failed, please contact admin",
                statusCode: 401
            })
        }
    },

    async reset_password(req, res) {
        const { password, passwordConfirm } = req.body
        const token = req.query.token || req.body.token
        try {
            const reset = await auth.resetPassword(token, password, passwordConfirm)
            if (!reset) throw new Error("An error occured")
            return res.ok({
                status: 'success',
                message: `Password reset successful`,
            })
        } catch (err) {
            return res.fail({
                status: 'Failed',
                message: "User password reset failed, please contact admin",
                statusCode: 401
            })
        }
    },
    async change_password(req, res) {
        const token = req.query.token
        try {
            const user = await auth.checkResetToken(token);

            const profile = {
                username: user[0].username,
                photo: user[0].photo,
                token
            }
            if (!profile) throw new Error("Invalid Request")
            return  res.render('reset-password.jade', {profile ,title: "Change Password" });
        } catch (err) {
            return res.fail({
                status: 'Failed',
                message: err.message || "User password reset failed, please contact admin",
                statusCode: 401
            })
        }
    },

    googlelogin(req, res) {
        return auth.google(req, res);
    },

    googleCallback(req, res, next) {
        return auth.googleCallback(req, res, next);
    },

    githublogin(req, res) {
        return auth.github(req, res);
    },

    githubCallback(req, res, next) {
        return auth.githubCallback(req, res, next);
    },

    async githubEmail(req, res, next) {

        const { email, githubUsername, githubId, githubPhoto, githubMeta, firstName, lastName } = req.body;

        try {
            const temp_password = crypto.randomBytes(20).toString('hex');

            const user = await User.create({
                github_id: githubId,
                username: githubUsername,
                email: email,
                password: temp_password,
                passwordConfirm: temp_password,
                photo: githubPhoto,
                github_meta: githubMeta,
                lastname: firstName,
                firstname: lastName,
            });


            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/api/v1/user/dashboard');
            });

        } catch (err) {
            next(err);
        }

    },

    renderEmail(req, res, next) {
        try {
            const profile = req.session.github_profile;
            res.render('email-form.jade', { profile: profile, title: "Github Email" });
        } catch (error) {
            next(error);
        }
    },

    resetPasswordView(req, res, next) {
        try {
           return res.render('reset-password.jade', { title: "Password Reset" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports.register = module.exports.register.bind(module.exports);