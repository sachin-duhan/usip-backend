const Register = require('../models/register');

exports.get_all_resgiterations = (req, res) => {
    Register.find({}).populate('application_title').then(data => {
        res.status(200).json({
            status: 'ok',
            message: 'applicants registered',
            application: data
        });
    }).catch(err => {
        res.status(400).json({
            message: 'not found!',
            error: err
        })
    });
}

exports.make_new_application = (req, res) => {
    Register.findOne({
        rollNo: req.body.rollNo,
        application_title: req.application_title_id
    }).then(data => {
        if (data) {
            res.status(406).json({
                status: 'Already registered',
                message: 'Application Already registered'
            });
        } else {
            const newReg = new Register({
                name: req.body.name,
                email: req.body.email,
                marks: req.body.marks,
                application_title: req.application_title_id, // set using middleware!
                rollNo: req.body.rollNo,
                branch: req.body.branch,
                phone: req.body.phone,
                domain: req.body.domain,
                exp: req.body.exp
            });
            newReg.save().then((data) => {
                res.status(201).json({
                    status: 'ok',
                    message: 'Application registered',
                    data: data
                });
            }).catch((err) => {
                res.status(400).json({
                    error: err
                });
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });

}

exports.get_current_active_applications = (req, res) => {
    Register.find({
        application_title: req.application_title_id
    }).populate('application_title').then(doc => {
        res.status(200).json({
            application: doc
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
}

exports.qualify_an_intern = (req, res) => {
    Register.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            isSelected: req.body.isSelected,
            interview: req.body.interview,
            interview_marks: req.body.marks,
            interview_attendence: req.body.interview_attendence,
            interview_comment: req.body.comment
        }
    }, (err) => {
        if (err) {
            res.json({
                status: result
            });
        } else {
            res.json({
                message: 'intern updated!'
            });
        }
    });
}

exports.get_specific_regsiter = (req, res) => {
    const id = req.params.id;
    Register.find({
            _id: id
        }).populate('application_title')
        .then(result => {
            if (result == null) {
                res.status(400).json({
                    message: 'No data found!!'
                });
            } else {
                res.status(200).json({
                    applicant: result
                });
            }
        })
        .catch(err => {
            res.status(400).json({
                err: err.message
            });
        });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Register.findOneAndDelete({
        _id: id
    }).then(result => {
        res.status(200).json({
            message: 'Intern Deleted!'
        });
    }).catch(err => {
        res.status(501).json({
            error: err
        });
    })
}