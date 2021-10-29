const Admin = require('../models/Admin')

const jwtDecode = require('jwt-decode')
const token = require('../security/token')
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const admin = await Admin.findByPk(req.body.id, { raw: true })

    if (admin && admin.password.localeCompare(hashedPassword)) {
        const accessToken = token.generateAccessToken(admin.id, admin.role)

        return res.status(200).json({ accessToken: accessToken })
    }

    return res.status(400).json({
        message: "login failed"
    })
}

updateInformation = async (req, res, column, newValue) => {
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
    return updateInformation(req, res, 'firstname', stringTool.capitalize(req.body.firstname))
}

exports.updateMiddlename = async (req, res) => {
    return updateInformation(req, res, 'middlename', stringTool.capitalize(req.body.middlename))
}

exports.updateLastname = async (req, res) => {
    return updateInformation(req, res, 'lastname', stringTool.capitalize(req.body.lastname))
}

exports.updateContactNo = async (req, res) => {
    return updateInformation(req, res, 'contactno', req.body.contactno)
}

exports.updateProfilePicture = async (req, res) => {
    return updateInformation(req, res, 'image_path', req.body.image_path)
}

exports.updatePassword = async (req, res) => {
    return updateInformation(req, res, 'password', req.body.password)
}