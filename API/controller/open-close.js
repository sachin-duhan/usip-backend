const Status = require('../models/open-close'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

const bank_title = require('../../config/keys').bank_title_for_DB,
    application_title = require('../../config/keys').application_title_for_DB;

exports.allow_bank = (req, res) => {
    Status.find({
        title: bank_title,
        isOpen: true
    }).then(result => {
        if (result.length > 0)
            return res.status(400).json(response_handler({}, false, "Application already open"));
        const date = new Date();
        if (date > req.body.end)
            return res.status(400).json(response_handler({}, false, "End time has to be later"));
        req.body.title = bank_title;
        req.body.details = "Intern are allowed to fill in their bank details";   
        const newApplication = new Status(req.body);
        newApplication.save()
        .then(result => res.status(200).json(response_handler(result, true, undefined, { status: true })))
        .catch(err => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_all_bank = (req, res) => {
    Status.find({ title: bank_title })
        .sort({ start: 'desc' })
        .then(result => res.status(200).json(response_handler(result, true, undefined)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_all_application = (req, res) => {
    Status.find({ title: application_title }).sort({
        start: 'desc'
    }).then(result => {
        return res.status(200).json(response_handler(result,true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.close_bank = (req, res) => {
    Status.updateMany({
        title: bank_title,
        isOpen: true,
    }, {
        $set: {
            isOpen: false
        }
    }, (err) => {
        if (err)
            return res.status(400).json(response_handler(err, false))
        return res.status(200).json(response_handler({}, true, "bank applications closed"));
    });
}

exports.get_bank_status = (req, res, next) => {
    Status.find({
        title: bank_title,
        isOpen: true
    }).then(result => {
        if (result.length > 0) req.is_bank_details_allowed = true;
        else req.is_bank_details_allowed = false;
        next();
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.allow_application = (req, res) => {
    Status.find({
        title: application_title,
        isOpen: true
    }).then(result => {
        if (result.length > 0)
            return res.json(response_handler(result, false, "Application already open"));
        const date = new Date();
        if (date > req.body.end)
            return res.json(response_handler({}, false, "End time has to be later than start date"));
        req.body.title = application_title;
        const newApplication = new Status(req.body);
        newApplication.save().then(result => {
            res.json(response_handler(result, true, "Application saved and opened successfully", { status: result }));
        }).catch(err => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.close_application = (req, res) => {
    Status.updateMany({
        title: application_title,
        isOpen: true,
    }, {
        $set: {
            isOpen: false
        }
    }, (err) => {
        if (err)
            return res.status(400).json(response_handler(err, false))
        return res.json(response_handler({}, true, "Applications closed successfully"));
    });
}

exports.get_application_status = (req, res, next) => {
    Status.find({
        title: application_title,
        isOpen: true
    }).then(result => {
        if (result.length > 0) req.is_application_open = true;
        else req.is_application_open = false;
        next();
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.get_current_application_title = (req, res, next) => {
    Status.find({
        title: application_title
    }).sort({
        start: 'desc'
    }).then(result => {
        if (result.length > 0)
            return res.status(200).json(response_handler(result, true, undefined, { title: result[0].details }));
        return res.status(404).json(response_handler(result, false, "No Records in DB", { title: null }));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}
