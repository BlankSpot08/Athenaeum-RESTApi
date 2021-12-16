const AdminRequest = require('../models/AdminRequest')
const Admin = require('../models/Admin')

exports.getAll = async (req, res) => {
    const adminRequests = await AdminRequest.findAll()

    return res.status(200).json(adminRequests)
}

exports.register = async (req, res) => {
    const adminRequest = await AdminRequest.create({
        id: req.body.id,
        password: req.body.password,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        emailaddress: req.body.emailaddress,
        contactno: req.body.contactno,
        role: `admin`,
    })

    return res.status(200).json(adminRequest)
}

exports.acceptRegistration = async (req, res) => {
    const adminRequest = await AdminRequest.findByPk(req.body.id)

    const admin = await Admin.create({
        id: adminRequest.id,
        password: adminRequest.password,
        firstname: adminRequest.firstname,
        middlename: adminRequest.middlename,
        lastname: adminRequest.lastname,
        emailaddress: adminRequest.emailaddress,
        contactno: adminRequest.contactno,
        role: `admin`,
    })

    adminRequest.destroy()

    return res.status(200).json(admin)
}

exports.rejectRegistration = async (req, res) => {
    const adminRequest = await AdminRequest.findByPk(req.body.id)

    adminRequest.destroy()

    return res.status(200).json(adminRequest)
}