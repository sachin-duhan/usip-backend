const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/access');
const keys = require('../../config/keys');

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
                role:user.role
            }, keys.JWT_key, {
                expiresIn: "0.5h"
            })
            return res.status(200).json({
                message: 'Successfully Logged In <3',
                admin: user.adminAccessGiven,
                role:user.role,
                token: token
            });
        } else {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: 'Auth Failed'
        })
    });
}

exports.get_all_users_with_access = (req, res) => {
    User.find({}).populate('userDetails').then(user => {
        if (user.length > 0) {
            res.status(200).json({
                count: user.length,
                intern: user
            });
        } else {
            res.status(200).json({
                message: 'No Intern have been registered!!'
            });
        }
    }).catch(err => {
        res.status(404).json({
            error: err
        })
    })
}

exports.make_new_user = (req, res) => {
    User.findOne({
        userDetails: req.body.userDetails
    }).then(user => {
        if (user) {
            res.status(400).json({
                message: 'User already have Login ID and password!!'
            });
        } else {
            // actual task for the user creation
            bcrypt.genSalt(10, function (err, salt) {
                if (!err) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (!err) {
                            // new user creation and saving:
                            const newUser = new User({
                                userDetails: req.body.userDetails, // tsoring th ID of the intern-ID
                                userName: req.body.userName,
                                password: hash
                            });
                            //console.log(newUser.password);
                            newUser.save().then(result => {
                                res.status(201).json({
                                    message: 'allowed Intern for Registeration',
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
            // end of user creation : 
        }
    }).catch(err => {
        res.status(409).json({
            message: 'User creation error !!',
            error: err
        });
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    User.findOneAndDelete({
        _id: id
    }, (err) => {
        if (!err) {
            res.status(200).json({
                message: 'intern is successfully deleted!!'
            });
        } else {
            res.status(404).json({
                message: err
            });
        }
    })
}

exports.get_specific_user = (req, res) => {
    const id = req.params.id;
    User.findOne({
        _id: id
    }).populate('userDetails').then(user => {
        if (user) {
            res.status(200).json({
                user: user
            });
        } else {
            res.status(404).json({
                message: 'user not found'
            });
        }
    }).catch(err => {
        res.status(200).json({
            error: err
        });
    })
}

exports.update_password = (req, res) => {
    const id = req.params.id;
    User.findOne({
        userDetails: id
    }).then(user => {
        var match = bcrypt.compareSync(req.body.password, user.password);
        if (user && match) {
            bcrypt.genSalt(10, function (err, salt) {
                if (!err) {
                    bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
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