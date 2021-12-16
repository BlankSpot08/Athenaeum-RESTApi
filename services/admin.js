const Admin = require('../models/Admin')

const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode')
const token = require('../security/token')
const emailSender = require('../config/emailSender')
const bcrypt = require('bcrypt')

exports.getAllAdmins = async (req, res) => {
    const admins = await Admin.findAll()

    return res.status(200).json(admins)
}

exports.getByID = async (req, res) => {
    const authHeader = req.headers['authorization']
    let adminInformation
    let token

    token = authHeader.split(' ')[1]
    adminInformation = jwtDecode(token)

    const admin = await Admin.findByPk(adminInformation.id, { raw: true })

    if (admin) {
        return res.status(200).json(admin)
    }

    return res.status(400).json()
}

exports.login = async (req, res) => {
    const admin = await Admin.findByPk(req.body.id, { raw: true })

    console.log(admin)
    console.log(await bcrypt.compare(req.body.password, admin.password))

    if (admin && await bcrypt.compare(req.body.password, admin.password) === true) {
        const accessToken = token.generateAccessToken(admin.id, admin.role)

        return res.status(200).json({ accessToken: accessToken })
    }

    return res.status(400).json({
        message: "login failed"
    })
}

updateAdminInformation = async (req, res, column, newValue) => {
    const authHeader = req.headers['authorization']
    let token
    let adminInformation

    token = authHeader.split(' ')[1]
    adminInformation = jwtDecode(token)

    try {
        const admin = await Admin.update({
            [column]: newValue
        }, {
            where: {
                id: adminInformation.id
            }
        })

        const temp = await Admin.findByPk(adminInformation.id)

        return res.status(200).json(temp)
    } catch (error) {
        console.log(`Error: ${error}`)

        res.status(400).json()
    }
}

exports.updateFirstname = async (req, res) => {
    return updateAdminInformation(req, res, 'firstname', stringTool.capitalize(req.body.firstname))
}

exports.updateMiddlename = async (req, res) => {
    return updateAdminInformation(req, res, 'middlename', stringTool.capitalize(req.body.middlename))
}

exports.updateLastname = async (req, res) => {
    return updateAdminInformation(req, res, 'lastname', stringTool.capitalize(req.body.lastname))
}

exports.updateContactNo = async (req, res) => {
    return updateAdminInformation(req, res, 'contactno', req.body.contactno)
}

exports.updateProfilePicture = async (req, res) => {
    return updateAdminInformation(req, res, 'image_path', req.body.image_path)
}

exports.updatePassword = async (req, res) => {
    return updateAdminInformation(req, res, 'password', req.body.password)
}

exports.authorizeToken = async (req, res) => {
    const token = req.body.token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: err
            })
        }

        if (user.role.localeCompare('admin') === 0) {
            return res.status(200).json(true)
        }

        return res.status(403).json(false)
    })
}

exports.forgetPassword = async (req, res) => {
    const email = req.body.email

    const admin = await Admin.findOne({ where: { emailaddress: email } })

    if (admin) {
        const temp = emailSender()

        const resetToken = token.generateResetToken(admin.id, 'admin')

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your Athenaeum password',
            text: `You're receiving this e-mail because you or someone else has requested a password reset for your user account at.\n\nClick the link below to reset your password:\nhttp://localhost:8080/?#/admin/account/reset-password/token/${resetToken}\n\nNote: The link is only valid for 10 minutes.\nIf you did not request a password reset you can safely ignore this email.`
        }

        temp.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({})
    }

    return res.status(400).json({})
}

exports.resetPassword = async (req, res) => {
    const token = req.body.token
    const newPassword = req.body.newPassword

    console.log(newPassword)

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({
                message: err
            })
        }

        await Admin.update(
            {
                password: newPassword
            },
            {
                where: {
                    id: user.id
                }
            })

        return res.status(200).json({})
    })
}