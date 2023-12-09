const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('../models/user');
const middleware = require('../middleware/index');
const crypto = require('crypto');
const mailer = require('../utils/mailer/azure_mailer')
const jwt = require('jsonwebtoken');
const queue = require('../azureQueue/init');
const ErrorResponse = require('../utils/errorResponse');
const MailService = require('../utils/mailer/mailService');
const mailService = new MailService();

module.exports = {
    signToken(id,token=null) {
        const signedToken = jwt.sign({ id ,token}, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
        return signedToken;
    },
    generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    },

    async verifyUserEmail(token) {
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            await User.findByIdAndUpdate(decoded.id, {
                verified: true
            })
            return true
        } catch (err) {
            throw err
        }
    },
    async forgotPasswordEmail(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return false
            }
            const token = this.generateToken(32)
            const resetToken = this.signToken(user._id, token);

            user.passwordResetToken = token;
            await User.updateOne({ _id: user._id }, { passwordResetToken: token });
            const constants = {
                username: user.username,
                reset_link: `https://${config.LIVE_BASE_URL}/api/v1/authenticate/change-password?token=${resetToken}`
            }
            const mailOptions = {
                email: user.email,
                subject: 'You requested a password reset',
                constants,
                template_id: "7c2c73bd-6ab1-436e-b839-2a217eb16327",
                username: user.username
            }

            await mailService.sendEmail({
                data: mailOptions
            });

            //await mailer.sendEmail(mailOptions)
            return true
        } catch (error) {
            throw error
        }

    },

    async resetPassword(token, password, passwordConfirm) {
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            if (!decoded) {
                return false
            }
            const user = await User.findById(decoded.id);
            if (!user) {
                return false
            }

            user.password = password;
            user.passwordConfirm = passwordConfirm;
            user.passwordResetToken = null;
            user.passwordResetAttempt = 0;
            await user.save();

            const constants = {
                username: user.username
            }
            const mailOptions = {
                email: user.email,
                subject: 'Successful Password Reset',
                constants,
                template_id: "b47a53f1-a0ec-4c2e-a7eb-7b4bd1cc5793",
                username: user.username
            }

            await mailService.sendEmail({
                data: mailOptions
            });

            return true
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    async checkResetToken(token) {
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            if (!decoded) {
                throw new ErrorResponse(
                    400,
                    "Invalid/Expired token"
                )
            }

            const findOption = {
                passwordResetToken: decoded.token
            }
            const user = await User.find(findOption);
            if (!user || !user.length) {
                throw new ErrorResponse(
                    400,
                    "Invalid/Expired token"
                )
            }
            return user
        } catch (err) {
            throw err
        }
    },

    async updatePassword(id, password, passwordConfirm, previousPassword) {
        try {
            const user = await User.findById(id);
            const isMatch = await user.comparePassword(previousPassword);
            if (!isMatch) {
                return false
            }
            user.password = password;
            user.passwordConfirm = passwordConfirm;
            await user.save();
            const constants = {
                username: user.username,
            }
            const mailOptions = {
                email: user.email,
                subject: 'Your password has been changed',
                constants,
                template_id: "b47a53f1-a0ec-4c2e-a7eb-7b4bd1cc5793",
                username: user.username
            }
            await mailService.sendEmail({
                data: mailOptions
            });

            return true
        } catch (err) {
            throw err
        }
    },

    async register(body) {
        try {
            const { email, password, firstname, username, lastname, stack, passwordConfirm } = body;
            const user = new User({ email, password, firstname, username, lastname, stack, passwordConfirm });
            await user.save();

            const token = this.signToken(user._id)

            try {
                const constants = {
                    username: user.username,
                    verification_link: `https://${config.LIVE_BASE_URL}/api/v1/authenticate/verify-email?token=${token}`,
                    message: `
                    Welcome to Technoob! We're thrilled to have you as a part of our community. 😊
                    Kindly hit the button below to verify your account
                    `
                }

                const mailOptions = {
                    email: user.email,
                    subject: 'Welcome to TechNoob!',
                    constants,
                    template_id: "7ef0d446-c456-487c-93e2-572e67849f6f",
                    username: user.username

                }

                await mailService.sendEmail({
                    data: mailOptions
                });

                return {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    stack: user.stack,
                    photo: user.photo,
                    active: user.active,
                    role: user.role,
                    verified: user.verified
                }
                //await mailer.sendEmail(mailOptions)
            } catch (err) {
                console.warn(err)
            }


            return user
        } catch (err) {
            throw err
        }
    },

    google(req, res) {
        return middleware.auth.googleAuthenticateMiddleware(req, res);
    },
    googleCallback(req, res, next) {
        return middleware.auth.googleCallbackAuthenticateMiddleware(req, res, next);
    },
    github(req, res) {
        return middleware.auth.githubAuthenticateMiddleware(req, res);
    },
    githubCallback(req, res, next) {
        return middleware.auth.githubCallbackAuthenticateMiddleware(req, res, next);
    },
    async githubEmail(email, profile, username, next) {
        try {
            let user = await User.findOne({ email });
            if (!user) {
                const temp_password = crypto.randomBytes(20).toString('hex');
                user = await User.create({
                    github_id: profile.id,
                    username: username,
                    lastname: username,
                    firstname: username,
                    email: email,
                    password: temp_password,
                    passwordConfirm: temp_password,
                    photo: profile.photos[0].value,
                    github_meta: profile,
                });
            }

            try {
                const constants = {
                    username: user.username,
                    verification_link: `https://${config.LIVE_BASE_URL}/api/v1/users/verify-email?token=${user.email}`,
                    password: temp_password
                }

                const mailOptions = {
                    email: user.email,
                    subject: 'Welcome to TechNoob!',
                    constants,
                    template_id: "7ef0d446-c456-487c-93e2-572e67849f6f",
                    username: user.username

                }
                await mailService.sendEmail({
                    data: mailOptions
                });

            } catch (err) {
            }

            return user;

        } catch (err) {
            throw err
        }
    }

}