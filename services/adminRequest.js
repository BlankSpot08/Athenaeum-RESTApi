const AdminRequest = require('../models/AdminRequest')
const Admin = require('../models/Admin')

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
        password: adminRequestpassword,
        firstname: adminRequestfirstname,
        middlename: adminRequestmiddlename,
        lastname: adminRequestlastname,
        emailaddress: adminRequestemailaddress,
        contactno: adminRequestcontactno,
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