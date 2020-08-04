const Officer = require('../models/officer'),
    Intern = require('../models/intern'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler,
    Officer_login = require('../models/officer_login');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');

exports.login = (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json(response_handler({}, false, "Username or Password is incorrect"));
    Officer_login.findOne({ userName: userName })
        .then(user => {
            var match = bcrypt.compareSync(password, user.password);
            if (user && match) {
                const token = jwt.sign({
                    id: user.officer,
                    userName: user.userName,
                    role: user.role
                }, keys.JWT_key, {
                    expiresIn: "0.5h"
                });
                return res.status(200).json({
                    message: 'success',
                    role: user.role,
                    token: token
                });
            } else return res.status(401).json(response_handler({}, false, "Authentication failed"));
        }).catch(err => res.status(400).json(response_handler(err, false, "Authentication failed")));
}

exports.update_password = (req, res) => {
    const id = req.params.id;
    Officer_login.findOne({
        officer: id
    }).then(user => {
        var match = bcrypt.compareSync(req.body.password, user.password);
        if (user && match) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return res.status(400).json(response_handler(err, false));
                bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                    if (err) return res.status(400).json(response_handler(err, false, "Bad request! Password hashing issue"));
                    user.password = hash;
                    user.save().then(result => {
                        return res.status(201).json(response_handler(result, true, "Password update is successful"))
                    }).catch(err => {
                        return res.status(400).json(response_handler(err, false, "Password not updated. Saving issue!"))
                    })
                });
            });
        } else return res.status(401).json(response_handler({}, false, "Wrong Password"));
    }).catch(err => {
        return res.status(400).json(response_handler(err, false))
    });
}


exports.make_new_officer_login_credentials = (req, res) => {
    let { id, userName, password } = req.body;
    if (!id || !userName || !password) return res.status(400).json(response_handler({}, false, "All feilds are mandatory"));
    Officer_login.findOne({ officer: id })
        .then(user => {
            if (user) return res.status(400).json(response_handler(user, false, 'Officer already have Login access'));
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return res.status(400).json(response_handler(err, false));
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) return res.status(400).json(response_handler(err, false));
                    password = hash;
                    const temp = { officer: id, userName, password };
                    const newOfficer = new Officer_login(temp);
                    newOfficer.save().then(
                        result => res.status(201).json(response_handler(result, true, "Officer access updated successfully"))
                    ).catch(err => res.status(400).json(response_handler(err, false, 'Bad request! come back later!! saving issue')))
                });
            });
        }).catch(err => res.status(409).json(response_handler(err, false)));
}


exports.get_all_officer = (req, res) => {
    Officer.find({
        active: true
    }).then(officer => {
        return res.status(200).json(response_handler(officer, true, undefined));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.update_officer_details = (req, res) => {
    const id = req.params.id;
    Officer.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            deptt: req.body.deptt
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        return res.json(response_handler(doc, true, "officer updated successfully"));
    });
}

exports.get_all_interns_for_officer = (req, res) => {
    const id = req.params.id;
    Intern.find({
        repOfficer: id
    }).then(result => {
        return res.status(200).json({
            intern: result
        })
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.make_new_officer = (req, res) => {
    Officer.findOne({
        phone: req.body.phone
    }).then(result => {
        if (result) return res.status(400).json(response_handler(result, false, "Officer already exist"));
        else {
            newOfficer = new Officer(req.body);
            newOfficer.save().then(result => {
                res.status(200).json(response_handler(result, true, undefined));
            }).catch(err => res.status(400).json(response_handler(err, false)));
        }
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.make_new_intern_and_assign_officer = (req, res) => {
    const id = req.params.id;
    const officer_id = req.body.officer_id;
    Intern.findOne({
        pInfo: id
    }).then(result => {
        if (result) return res.status(400).json(response_handler(result, false, "Intern already exist"))
        const newIntern = Intern({
            pInfo: id,
            depNo: req.body.depNo,
            bankName: 'Not filled',
            bankAc: id,
            ifsc: 'Not filled',
            start: req.body.start,
            end: req.body.end,
            repOfficer: officer_id
        });
        newIntern.save().then(intern => {
            res.status(200).json(response_handler({}, true, undefined, { intern: intern }));
        }).catch(err => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.make_officer_inactive = (req, res) => {
    const id = req.params.id;
    Officer.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            active: false
        }
    }, (err, doc) => {
        if (err) res.status(400).json(response_handler(err, false, "Officer can't be deleted!"));
        return res.json(response_handler(doc, true, "Officer deleted successfully"));
    });
}