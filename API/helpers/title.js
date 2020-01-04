const Status = require('../models/open-close');

exports.get_title = (req, res, next) => {
    Status.find({
        title: 'Allow application'
    }).sort({
        Start: 'desc'
    }).then(result => {
        req.application_title_id = result[0]._id;
        req.application_title = result[0].details;
        next();
    }).catch(err => {
        return res.status(400).json({
            message: 'cant process request!!'
        })
    });
}