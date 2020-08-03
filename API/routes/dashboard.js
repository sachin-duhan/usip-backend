const express = require('express');
const router = express.Router();

const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

const Application = require('../models/register'),
    Intern = require('../models/intern'),
    Officer = require('../models/officer'),
    Notification = require('../models/notification'),
    Report = require('../models/report');

router.get('/', async(req, res) => {
    Promise.all([
        // parallel processing of queries!!
        Application.find({ isDeleted: false }).countDocuments(),
        Intern.find({ isDeleted: false }).countDocuments(),
        Officer.find({}).countDocuments(),
        Report.find({}).countDocuments(),
        // make sure that order is not changed!!
        Application.find({ isDeleted: false }).sort({ date: -1 }).limit(5).populate('application_title'),
        Intern.find({ isDeleted: false }).sort({ date: -1 }).limit(12).populate('pInfo'),
        Report.find({}).sort({ date: -1 }).limit(5).populate({ path: 'intern', populate: { path: 'pInfo' } }),
        Officer.find({}).sort({ date: -1 }).limit(5),
        Notification.find({ isDeleted: false }).sort({ date: -1 }).limit(6)
    ]).then(([application_count, intern_count, officer_count, reports_count, applications, interns, reports, officers, notifications]) => {
        var count = { application: application_count, intern: intern_count, officer: officer_count, reports: reports_count };
        return res.status(200).json(response_handler({ count, applications, interns, reports, officers, notifications }, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
});

router.get('/intern/:id', (req, res) => {
    if (!req.params.id) return res.status(400).json(response_handler({}, false, "Intern ID is required"));
    Promise.all([
        Report.find({ intern: req.params.id }).populate({ path: 'intern', populate: { path: 'pInfo' } }).sort({ date: -1 }),
        Intern.findOne({ _id: req.params.id }).populate({ path: 'pInfo', populate: { path: 'application_title' } }).populate('repOfficer'),
        Notification.find({}).sort({ date: -1 }).limit(20),
    ]).then(([reports, interns, notifications]) => {
        return res.status(200).json(response_handler({ reports, interns, notifications }, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
});

module.exports = router;