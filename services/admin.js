const Admin = require('../models/Admin')

const token = require('../security/token')
const bcrypt = require('bcrypt')

exports.getAllAdmins = async (req, res) => {
    const admins = await Admin.findAll()

    return res.status(200).json(admins)
}

exports.getByID = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let adminInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        adminInformation = jwtDecode(token)
    } else {
        res.sendStatus(400)
        return
    }

    const admin = await Admin.findByPk(adminInformation.id, { raw: true })

    if (admin) {
        return res.status(200).json(admin)
    }

    return res.status(400).json()
}

exports.register = (req, res) => {
    Admin.create({
        id: req.body.id,
        password: req.body.password,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        emailaddress: req.body.emailaddress,
        contactno: req.body.contactno,
        balance: `0`,
        role: `admin`,
    })

    return res.status(200).json()
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