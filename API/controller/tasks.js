const Tasks = require('../models/tasks');

exports.get_all = (req, res) => {
    Tasks.find({}).populate('pInfo').then(result => {
        res.status(200).json({
            tasks: result
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
}

exports.make_new = (req, res) => {
    Tasks.find({
        title: req.body.title
    }).then(result => {
        if (result.length == 0) {
            task = new Tasks({
                title: req.body.title,
                pInfo: req.body.pInfo
            });
            task.save().then(result => {
                res.status(200).json({
                    message: 'Officer Created',
                    task: result
                });
            }).catch(err => {
                res.status(400).json({
                    error: err
                });
            });
        } else {
            res.status(200).json({
                message: 'task already found!'
            });
        }
    }).catch(err => {
        res.status(401).json({
            error: err
        })
    })
}

exports.delete_task = (req, res) => {
    const id = req.params.id;
    Tasks.findOneAndDelete({
        _id: id
    }, (err) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'Tasks Deleted successfully'
            });
        }
    });
}

exports.get_specific = (req, res) => {
    const id = req.params.id;
    Tasks.find({
        pInfo: id
    }).populate('pInfo').then(officer => {
        if (officer) {
            res.status(200).json({
                tasks: officer
            });
        } else {
            res.status(200).json({
                message: 'No tasks added'
            })
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
}