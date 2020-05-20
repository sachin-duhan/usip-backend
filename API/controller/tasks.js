const Tasks = require('../models/tasks'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all = (req, res) => {
    Tasks.find({})
    .populate({path:'pInfo',populate:{path:'pInfo'}}).populate('created_by')
    .sort({date:-1})
    .then(result => {
        res.status(200).json(response_handler(result, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.mark_task_completed = (req, res) => {
    Tasks.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            is_completed: req.body.is_completed,
            visible_to_intern: req.body.visible_to_intern
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false, "Task cannot be updated"));
        return res.status(200).json(response_handler(doc, true, "Task updated successfully"));
    });
}

// req params must contain officer ID!
exports.get_all_tasks_added_by_an_officer = (req, res) => {
    res.status(200).json(response_handler(result, true));
    Tasks.find({ created_by: req.params.id })
    .populate({path:'pInfo',populate:{path:'pInfo'}}).populate('created_by')
    .sort({date:-1})
    .then(task => res.status(200).json(response_handler(task, true)))
    .catch(err => res.status(400).json(response_handler(err, false)));
}

// body should contain - created_by, title, pInfo, visible_to_intern
exports.make_new = (req, res) => {
    Tasks.find({ title: req.body.title })
        .then(result => {
            if (result.length > 0)
                return res.status(200).json(res.status(400).json(response_handler({}, false, "Task already found!!")));
            newTask = new Tasks(req.body);
            newTask.save().then(result => {
                res.status(200).json(response_handler(result, true));
            }).catch(err => res.status(400).json(response_handler(err, false)));
        }).catch(err => res.status(400).json(response_handler(err, false)));
}

// task id is required in Params
exports.delete_task = (req, res) => {
    const id = req.params.id;
    Tasks.findOneAndDelete({
        _id: id
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false, "Task cannot be deleted"));
        return res.status(200).json(response_handler(doc, true, "Task deleted successfully"));
    });
}

// task ID must be in param!
exports.get_specific = (req, res) => {
    const id = req.params.id;
    Tasks.find({ pInfo: id })
        .populate({path:'pInfo',populate:'pInfo'}).populate('created_by')
        .sort({date:-1})
        .then(task => res.status(200).json(response_handler(task, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}