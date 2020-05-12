const Status = require('../models/open-close'),
    reponse_handler = require('./response_handler').send_formatted_reponse_handler;

exports.get_title = (req, res, next) => {
    Status.find({ title: 'Allow application' }).sort({ start: 'desc' })
        .then(result => {
            req.application_title_id = result[0]._id;
            req.application_title = result[0].details;
            next();
        }).catch(err => res.status(400).json(reponse_handler(err, false, "Server Error! Please try again later!")));
}