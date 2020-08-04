const express = require('express');
const router = express.Router();

const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

const Application = require('../models/register'),
    Intern = require('../models/intern'),
    Officer = require('../models/officer'),
    Notification = require('../models/notification'),
    Report = require('../models/report'),
    Task = require('../models/tasks');

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
        Task.find({ pInfo: req.param.id }).sort({ date: -1 }).limit(50),
    ]).then(([reports, intern, notifications, tasks]) => {
        return res.status(200).json(response_handler({ reports, intern, notifications, tasks }, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
});


router.get('/officer/:id', async(req, res) => {
    if (!req.params.id) return res.status(400).json(response_handler({}, false, "Officer ID is required"));
    const data = await Intern.find({ repOfficer: req.params.id }).populate('pInfo');
    let interns = [];
    data.forEach(intern => interns.push(intern._id));
    Promise.all([
        Report.find({ intern: { $in: interns } }).sort({ date: -1 }).populate({ path: 'intern', populate: { path: 'pInfo' } }),
        Officer.findOne({ _id: req.params.id }),
        Notification.find({}).sort({ date: -1 }).limit(30),
        Task.find({ created_by: req.params.id }).sort({ date: -1 }).limit(50).populate({ path: 'pInfo', populate: { path: 'pInfo' } }),
    ]).then(([reports, officer, notifications, tasks]) => {
        return res.status(200).json(response_handler({ reports, officer, notifications, tasks, interns:data }, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
});

module.exports = router;