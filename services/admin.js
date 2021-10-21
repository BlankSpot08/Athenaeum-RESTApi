const Admin = require('../models/Admin')

const token = require('../security/token')
const bcrypt = require('bcrypt')

exports.getAllAdmins = async (req, res) => {
    const admins = await Admin.findAll()

    res.send(admins)
    return
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

    res.sendStatus(200)
}

exports.login = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const admin = await Admin.findByPk(req.body.id, { raw: true })

    if (admin && admin.password.localeCompare(hashedPassword)) {
        const accessToken = token.generateAccessToken(admin.id, admin.role)

        res.send({ accessToken: accessToken })
        return
    }

    res.sendStatus(400)
}

exports.getByID = async (req, res) => {
    const admin = await Admin.findByPk(req.body.id, { raw: true })

    if (admin) {
        res.send(admin)
        return
    }

    res.sendStatus(400)
}