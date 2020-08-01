const express = require('express');
const router = express.Router();

const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;
const Application = require('../models/register'),
    Intern = require('../models/intern'),
    Officer = require('../models/officer'),
    Notification = require('../models/notification'),
    Report = require('../models/report');

router.get('/', async(req, res) => {

    var count = { application: 0, intern: 0, officer: 0, reports: 0 };
    count.application = await Application.find({ isDeleted: false }).countDocuments();
    count.intern = await Intern.find({ isDeleted: false }).countDocuments();
    count.officer = await Officer.find({ isDeleted: false }).countDocuments();
    count.reports = await Report.find({ isDeleted: false }).countDocuments();

    const applications = await Application.find({ isDeleted: false }).sort({ date: -1 }).limit(5).populate('application_title');
    const interns = await Intern.find({ isDeleted: false }).sort({ date: -1 }).limit(12).populate('pInfo');
    const reports = await Report.find({ isDeleted: false }).sort({ date: -1 }).limit(5).populate({ path: 'intern', populate: { path: 'pInfo' } });
    const officers = await Officer.find({ isDeleted: false }).sort({ date: -1 }).limit(5);
    const notifications = await Notification.find({ isDeleted: false }).sort({ date: -1 }).limit(5);

    return res.status(200).json(response_handler({ count, applications, interns, reports, officers, notifications }, true));
});

module.exports = router;