const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/access');
const keys = require('../../config/keys');

const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.login_user = (req, res) => {
    User.findOne({
        userName: req.body.userName
    }).then(user => {
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
        } else {
            return res.status(401).json(response_handler({}, false, "Authentication failed"))
        }
    }).catch(err => res.status(400).json(response_handler(err, false, "Authentication failed")));
}

exports.get_all_users_with_access = (req, res) => {
    User.find({}).populate('userDetails').then(user => {
        return res.status(200).json({
            count: user.length,
            intern: user
        });
    }).catch(err => res.status(404).json(response_handler(err, false)))
}

exports.make_new_user = (req, res) => {
    User.findOne({
        userDetails: req.body.userDetails
    }).then(user => {
        // avoiding duplicates
        if (user) return res.status(400).json(response_handler(user, false, 'User already have Login ID and password!!'));
        // when no user exist!!
        bcrypt.genSalt(10, function(err, salt) {
            if (!err) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if (!err) {
                        // new user creation and saving:
                        const newUser = new User({
                            userDetails: req.body.userDetails, // tsoring th ID of the intern-ID
                            userName: req.body.userName,
                            password: hash
                        });
                        newUser.save().then(result => {
                            res.status(201).json({
                                message: 'allowed Intern for Registeration',
                                intern: result
                            })
                        }).catch(err => res.status(400).json(response_handler(err, false, 'Bad request! come back later!! saving issue')))
                    }
                    // hashing fuckup! if any!!
                    else return res.status(400).json(response_handler({}, false, 'Bad request! come back later!! hashing issue'));
                });
            }
            return res.status(400).json(response_handler(err, false));
        });
    }).catch(err => res.status(409).json(response_handler(err, false)));
}

exports.delete = (req, res) => {
    const id = req.params.id;
    User.findOneAndDelete({
        _id: id
    }, (err, doc) => { // callback function!!
        if (!err)
            return res.status(200).json(response_handler(doc, true, 'Intern Access is successfully deleted'));
        return res.status(404).json(response_handler(err, false, "Intern Login access can't be deleted!"));
    });
}

exports.get_specific_user = (req, res) => {
    const id = req.params.id;
    User.findOne({
        _id: id
    }).populate('userDetails').then(user => {
        return res.status(200).json({
            user: user
        });
    }).catch(err => {
        res.status(200).json(response_handler(err, false));
    })
}

exports.update_password = (req, res) => {
    const id = req.params.id;
    User.findOne({
        userDetails: id
    }).then(user => {
        var match = bcrypt.compareSync(req.body.password, user.password);
        if (user && match) {
            bcrypt.genSalt(10, function(err, salt) {
                if (!err) {
                    bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                        if (!err) {
                            user.password = hash;
                            //console.log(newUser.password);
                            user.save().then(result => {
                                res.status(201).json({
                                    message: 'Password update is successful!',
                                    intern: result
                                })
                            }).catch(err => {
                                res.status(400).json({
                                    message: 'Bad request! come back later!! saving issue',
                                    error: err
                                });
                            })
                        } else {
                            res.status(400).json({
                                message: 'Bad request! come back later!! hashing issue',
                                error: err
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        message: 'Bad request! come back later!! 1',
                        error: err
                    });
                }
            });
        } else {
            return res.status(401).json('Current password enter is wrong!');
        }
    }).catch(err => {
        res.status(400).json({
            message: 'Auth Failed!',
            error: err
        })
    })
}

exports.update_password_by_admin = (req, res) => {
    const id = req.params.id;
    User.findOne({
        userDetails: id
    }).then(user => {
        bcrypt.genSalt(10, function(err, salt) {
            if (!err) {
                bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                    if (!err) {
                        user.password = hash;
                        //console.log(newUser.password);
                        user.save().then(result => {
                            res.status(201).json({
                                message: 'Password update is successful!',
                                intern: result
                            })
                        }).catch(err => {
                            res.status(400).json({
                                message: 'Bad request! come back later!! saving issue',
                                error: err
                            });
                        })
                    } else {
                        res.status(400).json({
                            message: 'Bad request! come back later!! hashing issue',
                            error: err
                        });
                    }
                });
            } else {
                res.status(400).json({
                    message: 'Bad request! come back later!! 1',
                    error: err
                });
            }
        });
    }).catch(err => {
        res.status(400).json({
            message: 'Auth Failed!',
            error: err
        })
    })
}