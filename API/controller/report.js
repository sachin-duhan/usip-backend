const Report = require('../models/report'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all = (req, res) => {
    Report.find({}).populate({
        path: 'intern',
        populate: {
            path: 'pInfo'
        }
    }).then(report => {
        res.status(200).json(response_handler({}, true, undefined, { reports: report }))
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_active_interns_report = (req, res) => {
    Report.find({}).populate({
            path: 'intern',
            populate: {
                path: 'pInfo'
            }
        }).where({ "intern.pInfo.application_title": req.application_title })
        .then(report => res.status(200).json(response_handler({}, true, undefined, { reports: report })))
        .catch(err => res.status(400).json(response_handler(err, false)))
}

exports.make_new = (req, res) => {
    const id = req.params.id; // user Id who is uploading the image!!
    Report.find({
        intern: id,
        start: req.body.start,
        end: req.body.end
    }).then(result => {
        if (result.length > 0)
            return res.status(400).json(response_handler(result, false, "Report already exist"));
        const report = Report({
            intern: id, // connecting intern schema!!
            description: req.body.description,
            start: req.body.start,
            end: req.body.end,
            reportImage: req.file.path
        });
        report.save().then(result => {
            res.status(200).json(response_handler({}, true, undefined, { report: result }));
        }).catch(err => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.delete = (req, res) => {
    Report.findOneAndDelete({
        _id: req.params.id
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false));
        return res.status(200).json(response_handler(doc, true, "Report Deleted successfully"));
    });
}

exports.get_single_specific = (req, res) => {
    Report.find({ _id: req.params.id }).populate({
            path: 'intern',
            populate: {
                path: 'pInfo'
            }
        })
        .then(report => res.json(response_handler({}, true, undefined, { reports: report })))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_all_for_intern_reports = (req, res) => {
    Report.find({ intern: req.params.id }).populate({
            path: 'intern',
            populate: {
                path: 'pInfo'
            }
        }).then(report => res.json(response_handler({}, true, undefined, { reports: report })))
        .catch(err => res.status(400).json(response_handler(err, false)));
}