const Officer = require('../models/officer');
const Intern = require('../models/intern');

exports.get_all_officer = (req, res) => {
    Officer.find({}).then(officer => {
        if (officer && officer.length >= 1) {
            res.status(200).json({
                officers: officer
            });
        } else {
            res.status(404).json({
                message: 'No officer have been registered!!'
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
}

exports.create = (req, res) => {
    Officer.find({
        phone: req.body.phone
    }).then(result => {
        if (result && result.length > 0) {
            res.status(400).json({
                message: 'Officer already Exist'
            });
        } else {
            newOfficer = new Officer({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                deptt: req.body.deptt,
            });
            newOfficer.save()
                .then(result => {
                    res.status(200).json({
                        message: 'Officer Created',
                        officer: result
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        error: err
                    });
                });
        }
    }).catch(err => {
        res.status(401).json({
            error: err
        })
    })
}

exports.update = (req, res) => {
    const id = req.params.id;
    const officer_id = req.body.officer_id;
    Intern.findOne({
        pInfo: id
    }).exec().then(result => {
        // making new intern
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
            res.status(200).json({
                message: 'intern updated',
                intern: intern
            });
        }).catch(err => {
            res.status(400).json({
                error: err
            });
        });
    }).catch(err => {
        res.status(400).json({
            error: err,
            message: 'Intern cant be updated!'
        })
    });
}

exports.delete_a_specific_intern = (req, res) => {
    const id = req.params.id;
    Officer.findOne({
        _id: req.body.id
    }).then(result => {
        var flag = false;
        for (var i = 0; i < result.interns.length; i++) {
            if (result.interns[i]._id == id) {
                result.interns.splice(i, 1);
                flag = true;
            }
        }
        if (flag = false) {
            res.status(400).json({
                message: 'Intern not found'
            })
        } else {
            result.save().then(result => {
                Intern.findOneAndUpdate({
                    _id: id
                }, {
                    $set: {
                        repOfficer: null
                    }
                }, (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'Error has occured!',
                            error: err
                        });
                    } else {
                        res.status(200).json({
                            message: 'Intern updated!'
                        });
                    }
                });
            }).catch(err => {
                res.status(400).json({
                    message: 'Error has occured!',
                    error: err
                })
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: 'Error has occured!',
            error: err
        })
    });
}

exports.delete_an_officer = (req, res) => {
    const id = req.params.id;
    Officer.findOneAndDelete({
        _id: id
    }, (err) => {
        if (err) {
            res.json({
                error: err
            });
        }
    });

    Intern.updateMany({
        repOfficer: id
    }, {
        $set: {
            repOfficer: null
        }
    }, (err) => {
        if (err) {
            return res.status(400).json({
                message: 'intern not updated!'
            });
        }
        res.json({
            message: 'updated!'
        })
    });
}