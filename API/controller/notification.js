const Notification = require('../models/notification'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_public_notification = (req, res) => {
    Notification.find({ visiblity: true })
        .then(result => res.status(200).json(response_handler(result, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_intern_notification = (req, res) => {
    Notification.find({ visiblity: false })
        .then(result => res.status(200).json(response_handler(result, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.make_new_notification = (req, res) => {
    const newNotification = new Notification(req.body);
    newNotification.save().then(notification => res.status(200).json(response_handler(notification, true, "Notification added successfully")))
        .catch(err => res.status(400).json(response_handler(err, false, "")));
}

exports.update = (req, res) => {
    const id = req.params.id;
    Notification.findOneAndUpdate({ _id: id }, {
        $set: {
            title: req.body.title,
            description: req.body.description
        }
    }, (err, doc) => {
        if (err)
            return res.status(400).json(response_handler(err, false, "Notification not updated!"));
        return res.status(200).json(response_handler(doc, true, "Notification updated successfully"));
    })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Notification.findOneAndDelete({ _id: id }, (err, doc) => {
        if (err)
            return res.status(400).json(response_handler(err, false));
        return res.status(200).json(response_handler(doc, true, "Notification Deleted successfully"));
    });
}