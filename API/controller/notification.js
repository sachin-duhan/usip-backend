const Notification = require('../models/notification'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;
const AWS_upload = require('../services/file_upload_aws');

exports.get_public_notification = (req, res) => {
    Notification.find({ visiblity: true, isDeleted:false }).sort({date:-1})
        .then(result => res.status(200).json(response_handler(result, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_intern_notification = (req, res) => {
    Notification.find({ visiblity: false, isDeleted:false }).sort({date:-1})
        .then(result => res.status(200).json(response_handler(result, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.make_new_notification = async (req, res) => {
    const upload = req.body.is_image && req.body.is_image === 'true' ? true : false;
    // if (upload) await AWS_upload.single("image");
    if (!req.body || !req.body.title || !req.body.description)
        return res.status(400).json(response_handler({}, false, "Invalid Request"));
    req.body.fileLocation = req.file && req.file.location ? req.file.location : null;
    const newNotification = new Notification(req.body);
    newNotification.save()
        .then(notification => res.status(200).json(response_handler(notification, true, "Notification added successfully")))
        .catch(err => res.status(400).json(response_handler(err, false, "Error in saving notification")));
}

exports.update = (req, res) => {
    const id = req.params.id;
    if(!req.file.location) return res.status(400).json(response_handler({},false,"No file uploaded!"));
    Notification.findOneAndUpdate({ _id: id }, {
        $set: {
            title: req.body.title,
            description: req.body.description
        }
    }, (err, doc) => {
        if (err)
            return res.status(400).json(response_handler(err, false, "Notification not updated!"));
        return res.status(200).json(response_handler(doc, true, "Notification updated successfully"));
    });
}

exports.update_file = (req, res) => {
    const id = req.params.id;
    Notification.findOneAndUpdate({ _id: id }, {
        $set: {
            fileLocation:req.file.location
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