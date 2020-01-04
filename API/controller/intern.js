const Intern = require('../models/intern');
const Register = require('../models/register');

exports.get_all_qualified = (req, res) => {
    Register.find({
        isSelected: true
    }).populate('application_title').then(result => {
        if (result.length > 0) {
            res.status(200).json({
                interns: result
            });
        } else {
            res.status(200).json({
                message: 'No Qualified Intern found'
            });
        }
    }).catch(err => {
        res.status(400).json(err);
    });
}

exports.get_specific_qualification = (req, res) => {
    const id = req.params.id;
    Register.findOne({
        isSelected: true,
        _id: id
    }).populate('application_title').then(result => {
        if (result) {
            res.status(200).json({
                intern: result
            });
        } else {
            res.status(400).json({
                message: 'No Intern found'
            });
        }
    }).catch(err => {
        res.status(400).json(err);
    })
}

exports.get_all_registered_interns = (req, res) => {
    Intern.find({}).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).populate('repOfficer').then(result => {
        if (result.length > 0) {
            res.status(200).json({
                message: 'Interns have regsitered their bank details',
                interns: result
            });
        } else {
            res.status(404).json({
                message: 'No Intern is found'
            });
        }
    }).catch(err => {
        res.status(400).json(err);
    });
}

exports.get_current_active_interns = (req, res) => {
    Intern.find({}).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).populate('repOfficer').where({
        'pInfo.application_title._id': req.application_title_id
    }).then(doc => {
        res.status(200).json({
            intern: doc,
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
}

exports.get_specific_registered_interns = (req, res) => {
    const id = req.params.id;
    Intern.findOne({
        _id: id
    }).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).populate('repOfficer').then(intern => {
        if (!intern) {
            res.status(404).json({
                error: err
            });
        } else {
            res.status(200).json({
                intern: intern
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
}

exports.make_new = (req, res) => {
    Intern.findOne({ // this is just for finding some duplicate entry!
        pInfo: req.body.id
    }).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).populate('repOfficer').then(intern => {
        if (intern) {
            res.status(406).json({
                message: `Deployment No. is already resgistered`
            })
        } else {
            const intern = new Intern({
                pInfo: req.body.id,
                depNo: req.body.depNo,
                bankAc: req.body.bankAc,
                ifsc: req.body.ifsc,
                bankName: req.body.bankName
            });
            intern.save().then(intern => {
                res.status(200).json({
                    message: 'intern created'
                })
            }).catch((err) => {
                res.json(err);
            });
        }
    }).catch(err => {
        res.status(200).json({
            error: err
        });
    });
}

exports.delete = (req, res) => {
    const id = req.params.id
    Intern.findOneAndDelete({
        _id: id
    }, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.status(200).json({
                message: 'Intern Deleted'
            });
        }
    });
}

exports.update_bank_details = (req, res) => {
    const id = req.params.id;
    Intern.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            bankAc: req.body.bankAc,
            ifsc: req.body.ifsc,
            bankName: req.body.bankName
        }
    }, (err) => {
        if (err) {
            res.status(304).json({
                error: err,
                message: 'details cant be updated'
            });
        } else {
            res.status(200).json({
                message: 'Details updated'
            });
        }
    });
}