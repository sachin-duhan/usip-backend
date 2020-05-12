const Register = require('../models/register'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all_resgiterations = (req, res) => {
    Register.find({}).populate('application_title').then(data => {
        res.status(200).json(response_handler({}, true, undefined, { application: data }));
    }).catch(err => res.status(400).json(response_handler(err, false)));
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
            req.body.application_title = req.application_title;
            const newReg = new Register(req.body);
            newReg.save().then((data) => {
                res.status(201).json({
                    status: 'ok',
                    message: 'Application registered',
                    data: data
                });
            }).catch((err) => res.status(400).json(response_handler(err, false)));
        }
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_current_active_applications = (req, res) => {
    Register.find({
        application_title: req.application_title_id
    }).populate('application_title').then(doc => {
        res.status(200).json({
            application: doc
        })
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.qualify_an_intern = (req, res) => {
    // Register.findOneAndUpdate({
    //     _id: req.params.id
    // }, {
    //     $set: {
    //         isSelected: req.body.isSelected,
    //         interview: req.body.interview,
    //         interview_marks: req.body.marks,
    //         interview_attendence: req.body.interview_attendence,
    //         interview_comment: req.body.comment
    //     }
    // }, (err) => {
    //     if (err) res.status(400).json(response_handler(err, false))
    //     else {
    //         res.json({
    //             message: 'intern updated!'
    //         });
    //     }
    // });
}

exports.get_specific_regsiter = (req, res) => {
    const id = req.params.id;
    Register.find({
        _id: id
    }).populate('application_title').then(result => {
        res.status(200).json({
            applicant: result
        });
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Register.findOneAndUpdate({
        _id: id
    }, { $set: { isDeleted: true } }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        else res.status(200).json(response_handler(doc, true, "Intern deleted successfully"));
    })
}