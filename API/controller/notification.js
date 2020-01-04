const Notification = require('../models/notification');

exports.get_public_notification = (req, res) => {
    Notification.find({
        visiblity: true
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                notifications: result
            });
        } else {
            res.status(200).json({
                message: 'No Public notification found'
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: 'Error in getting notification!'
        })
    })
}

exports.get_intern_notification = (req, res) => {
    Notification.find({
        visiblity: false
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                notifications: result
            });
        } else {
            res.status(200).json({
                message: 'No Intern notification found'
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: 'Error in getting notification!'
        })
    })
}

exports.make_new_notification = (req, res) => {
    const newNotification = new Notification({
        title: req.body.title,
        visiblity: req.body.visiblity
    });
    newNotification.save().then(notification => {
        res.status(200).json({
            result: notification,
            message: 'Notification Added'
        });
    }).catch(err => {
        res.status(400).json({
            message: "Cant Save the Notification!"
        });
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Notification.findOneAndDelete({
        _id: id
    }, (err) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'Notification Deleted successfully'
            });
        }
    });
}