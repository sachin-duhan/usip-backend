const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/access');
const keys = require('../../config/keys');

const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.login_user = (req, res) => {
    User.findOne({userName: req.body.userName})
    .then(user => {
        var match = bcrypt.compareSync(req.body.password, user.password);
        if (user && match) {
            const token = jwt.sign({
                id: user.userDetails,
                userName: user.userName,
                admin: user.adminAccessGiven,
                role: user.role
            }, keys.JWT_key, {
                expiresIn: "0.5h"
            })
            return res.status(200).json({
                message: 'Successfully Logged In <3',
                admin: user.adminAccessGiven,
                role: user.role,
                token: token
            });
        } else return res.status(401).json(response_handler({}, false, "Authentication failed"))
    }).catch(err => res.status(400).json(response_handler(err, false, "Authentication failed")));
}

exports.get_all_users_with_access = (req, res) => {
    User.find({}).then(user => {
        return res.status(200).json({
            count: user.length,
            intern: user
        });
    }).catch(err => res.status(404).json(response_handler(err, false)))
}

exports.make_new_user = (req, res) => {
    User.findOne({userDetails: req.body.userDetails})
    .then(user => {
        if (user) return res.status(400).json(response_handler(user, false, 'User already have Login ID and password!!'));
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return res.status(400).json(response_handler(err, false));
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if (err) return res.status(400).json(response_handler({}, false, 'Bad request! come back later!! hashing issue'));
                const newUser = new User({
                    userDetails: req.body.userDetails, // storing th ID of the intern-ID
                    userName: req.body.userName,
                    password: hash
                });
                newUser.save().then(
                    result => res.status(201).json(response_handler(result,true,"Intern access updated successfully"))
                ).catch(err => res.status(400).json(response_handler(err, false, 'Bad request! come back later!! saving issue')))
            });
        });
    }).catch(err => res.status(409).json(response_handler(err, false)));
}

exports.get_specific_user = (req, res) => {
    User.findOne({_id: req.params.id })
    .populate('userDetails').then( user => res.status(200).json(response_handler(user,true)))
    .catch(err => res.status(400).json(response_handler(err, false)))
}

exports.update_password = (req, res) => {
    User.findOne({userDetails: req.params.id}).then(user => {
        var match = bcrypt.compareSync(req.body.password, user.password);
        if (user && match) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return res.status(400).json(response_handler(err,false));
                bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                    if (err) return res.status(400).json(response_handler(err,false,"Bad request! Password hashing issue"));    
                    user.password = hash;
                    user.save().then(result => {
                        return res.status(201).json(response_handler(result,true,"Password update is successful"))
                    }).catch(err => {return res.status(400).json(response_handler(err,false,"Password not updated. Saving issue!"))})
                });
            });
        } 
        else return res.status(401).json(response_handler({},false,"Wrong Password"));
    }).catch(err => { return res.status(400).json(response_handler(err,false))});
}

exports.update_password_by_admin = (req, res) => {
    const id = req.params.id;
    User.findOne({ userDetails: id })
    .then(user => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return res.status(400).json(response_handler(err,false));
            bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                if (err) return res.status(400).json(response_handler(err,false));
                user.password = hash;
                user.save().then( result => res.status(201).json(response_handler(result,true,"password updated successfully")))
                .catch(err => res.status(400).json(response_handler(err,false)));                
            });
        });
    }).catch(err => res.status(400).json(response_handler(err,false)));
}

exports.delete = (req, res) => {
    // params ID should be from the Access collection ID! it cant be simple intern or registeration ID!
    User.findOneAndDelete({ _id: req.params.id },(err, doc) => {
        if (!err) return res.status(200).json(response_handler(doc, true, 'Intern Access is successfully deleted'));
        return res.status(404).json(response_handler(err, false, "Intern Login access can't be deleted!"));
    });
}