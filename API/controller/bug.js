const Bug = require('../models/bug');
const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all_bugs = (req, res) => {
    Bug.find({}).sort({
        date: -1
    }).populate('pInfo').then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => {
        return res.status(400).json(response_handler(err, false));
    })
}

exports.delete_a_bug_using_id = (req, res) => {
    const id = req.params.id;
    Bug.findOneAndDelete({
        _id: id
    }).then(result => {
        return res.status(200).json(response_handler(result, true, "Bug deleted successfully"));
    }).catch(err => res.status(501).json(response_handler(err, false)));
}

exports.get_specific_bug = (req, res) => {
    // id should be the intern id
    Bug.findOne({
        pInfo: req.params.id
    }).then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => {
        return res.status(400).json(response_handler(err, false));
    })
}

exports.update_bug_or_mark_it_resolved = (req, res) => {
    Bug.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            title: req.body.title,
            description: req.body.details,
            isResolved: req.body.isResolved
        }
    }, (err, doc) => {
        if (!err) return res.status(200).json(response_handler(doc, true));
        else return res.status(400).json(response_handler(err, false));
    })
}

exports.make_new_bug = (req, res) => {
    Bug.findOne({ title: req.body.title }).then(result => {
        if (result) {
            return res.status(404).json(response_handler(result, false, 'Bug is already Registered'));
        } else {
            const newBug = new Bug({
                title: req.body.title,
                description: req.body.details,
                pInfo: req.body.pInfo
            });
            newBug.save().then(result => res.status(200).json(response_handler(result, true, 'Thank you for helping us.')))
                .catch(err => res.status(400).json(response_handler(err, false)));
        }
    }).catch(err => res.status(400).json(response_handler(err, false)));
}