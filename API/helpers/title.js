const Status = require('../models/open-close'),
    reponse_handler = require('./response_handler').send_formatted_reponse_handler;

const application_title_val = require('../../config/keys').application_title_for_DB;
exports.get_title = (req, res, next) => {
    Status.find({ title: application_title_val }).sort({ start: 'desc' })
        .then(result => {
            req.application_title_id = result[0]._id;
            req.application_title = result[0].details;
            next();
        }).catch(err => res.status(400).json(reponse_handler(err, false, "Server Error! Please try again later!")));
}