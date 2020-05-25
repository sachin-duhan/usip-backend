const Register = require('../models/register'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all_resgiterations = (req, res) => {
    Register.find({
        isDeleted: false
    }).populate('application_title').sort({date:-1}).then(data => {
        res.status(200).json(response_handler(data, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.make_new_application = (req, res) => {
    if (!req.is_application_open) return res.status(400).json(response_handler({}, false, "Applications are not allowed in the backend"));
    Register.findOne({
        rollNo: req.body.rollNo,
        application_title: req.application_title_id,
        isDeleted: false
    }).then(data => {
        if (data)
            return res.status(406).json(response_handler(data, false, "Application already registered!"));
        req.body.application_title = req.application_title_id;
        const newReg = new Register(req.body);
        newReg.save().then((data) => {
            res.status(201).json(response_handler(data, true, "Application submitted successfully"));
        }).catch((err) => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_current_active_applications = (req, res) => {
    Register.find({
        application_title: req.application_title_id,
        isDeleted: false
    }).populate('application_title').then(doc => res.status(200).json(response_handler(doc, true)))
    .catch(err => res.status(400).json(response_handler(err, false)))
}

exports.qualify_an_intern = (req, res) => {
    const id = req.params.id;
    Register.findOneAndUpdate({
        _id: id,
        isDeleted: false
    }, {
        $set: {
            isQualified: true
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        else return res.status(200).json(response_handler(doc, true, "Interns updated successfully"));
    });
}

exports.disqualify_an_intern = (req, res) => {
    const id = req.params.id;
    Register.findOneAndUpdate({
        _id: id,
        isDeleted: false
    }, {
        $set: {
            isQualified: false
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        else return res.status(200).json(response_handler(doc, true, "Interns updated successfully"));
    });
}
exports.qualify_intern_in_bulk = (req, res) => {
    if (!req.body.interns || req.body.interns.length == 0) return res.status(400).json(response_handler({}, false, "You must select atleast one application."));
    Register.updateMany({
        _id: {
            $in: req.body.interns
        },
        isQualified: false,
        isDeleted: false
    }, {
        $set: {
            isQualified: true
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        else return res.status(200).json(response_handler(doc, true, "Interns updated successfully"));
    });
}

exports.get_specific_regsiter = (req, res) => {
    const id = req.params.id;
    Register.find({
        _id: id,
        isDeleted: false
    }).populate('application_title').then(result => {
        res.status(200).json({
            applicant: result
        });
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Register.findOneAndUpdate({
        _id: id,
        isDeleted: false,
        isQualified: false
    }, {
        $set: {
            isDeleted: true
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        else res.status(200).json(response_handler(doc, true, "Intern deleted successfully"));
    })
}

// params must contain application_title_ID!!
exports.get_all_qualified_students = (req, res) => {
    // const period_id = req.params.id;
    Register.find({
            // application_title: period_id,
            isQualified: true
        }).then(doc => res.status(200).json(response_handler(doc, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}