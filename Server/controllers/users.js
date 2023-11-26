const services = require("../services/index");
const { mailing_list } = require("../services/user");
const users = services.user
const worker = require('../utils/child')

module.exports = {
    async dashboard(req, res) {
        const userId = req.user._id 
        try {
            const reponse = await users.getDashboard(userId)
            return res.ok({
                status: "success",
                message: `User dashboard loaded`,
                data: reponse
            })
        } catch (err) {
            return res.fail(
                {
                    message: "An error occured, please contact admin"
                }
            )
        }
    },

    async edit(req, res) {
        const { update_params } = req.body
        let updateObject = update_params;
        const user_id = req.user._id
        try {
            const updated_user = await users.edit(user_id, updateObject)
            return res.ok({
                status: "success",
                message: `User information updated`,
                data: updated_user
            })
            
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },
    async editPassword(req, res) {
        const {  password, previous_password } = req.body
        const user_id = req.user._id
        try {
            const response = await users.editPassword( user_id , password, previous_password)
            return res.ok({
                status: "Success",
                message: `User Password updated`,
                data: response
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async editPhoto(req, res) {
        const {  photo } = req.body
        const user_id = req.user._id
        
        try {
            const user = await users.editPhoto( user_id, photo)
            return res.ok({
                status: "success",
                message: `User photo updated`,
                data: user
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async deactivate(req, res) {
        const user_id = req.user._id

        try {
            const user = await users.deactivate(user_id)
            return res.ok({
                status: "success",
                message: `User deactivated`,
                data: user
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async activate(req, res) {
        const user_id = req.user._id
        try {
            const user = await users.activate(user_id)
            return res.ok({
                status: "success",
                message: `User activated`,
                data: user
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async delete(req, res) {
        const user_id = req.user._id
        try {
            const user = await users.delete(user_id)
            return res.ok({
                status: "success",
                message: `User deleted`,
                data: user
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async linkGithub(req,res){
        if (!req.user) { 
            throw new Error('You must be logged in to connect your Github account')
        }
        try {
            res.redirect('/auth/github')
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async getOne(req, res) {
        try {
            const user_id = req.params.id
                if(!user_id) {
                    throw new Error("Please provide a user Id")
            }
            const user = await users.getOne(user_id)
            return res.ok({
                status: "success",
                message: `User found`,
                data: user
            })
        } catch (err) {
            return res.fail({
                status: "error",
                message: "User Not Found"
            })
        }
    },

    async getProfile(req, res) {
        const user_id = req.user._id
        try {
            const user = await users.getOne(user_id);
            return res.ok({
                status: "success",
                message: `User found`,
                data: user
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: "User Not Found"
            })
        }
    },

    async getAll(req, res) {
        const query = req.query
        try {
            const user = await users.getAll(query)
            return res.ok({
                status: "success",
                message: `${user.count} users found`,
                data: user
            })
        } catch (err) {
            console.log(err)
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async contact_us(req, res) {
        const { name, email, message } = req.body
        try {
            const contact = await users.contact_us(name, email, message)
            return res.ok({
                status: "success",
                message: `Message sent`,
                data: contact
            })
        } catch (err) {
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    },

    async mailing_list(req, res) {
        const { email } = req.body

        try {
            await users.mailing_list(email)
            return res.ok(
                {
                    status: "Success",
                    message: "Added Successfully",
                }
            )
        } catch (err) {
            
            return res.fail({
                status: "error",
                message: err.message
            })
        }
    }

}