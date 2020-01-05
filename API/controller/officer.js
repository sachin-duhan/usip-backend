const Officer = require('../models/officer');
const Intern = require('../models/intern');

exports.get_all_officer = (req, res) => {
    Officer.find({
        active: true
    }).then(officer => {
        return res.status(200).json({
            officers: officer
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
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
    }, (err) => {
        if (err) {
            return res.status(400).json({
                message: 'officer not updated!'
            });
        }
        return res.json({
            message: 'Officer updated!'
        })
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
    }).catch(err => {
        return res.status(400).json({
            error: err
        });
    })
}

exports.make_new_officer = (req, res) => {
    Officer.findOne({
        phone: req.body.phone
    }).then(result => {
        if (result) {
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

exports.make_new_intern_and_assign_officer = (req, res) => {
    const id = req.params.id;
    const officer_id = req.body.officer_id;
    Intern.findOne({
        pInfo: id
    }).exec().then(result => {
        if (result) {
            return res.status(400).json({
                message: 'Intern already exist'
            });
        } else {
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
        }
    }).catch(err => {
        res.status(400).json({
            error: err,
            message: 'Intern cant be updated!'
        })
    });
}

exports.make_officer_inactive = (req, res) => {
    const id = req.params.id;
    Officer.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            active: false
        }
    }, (err) => {
        if (err) {
            return res.status(400).json({
                message: 'officer not deleted!'
            });
        }
        return res.json({
            message: 'Officer is inactive!'
        })
    });
}