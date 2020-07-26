const Interview = require('../models/interview'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all_interview_list = (req, res) => {
    Interview.find({}).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_query_based_interview_list = (req, res) => {
    let marks = req.params.marks ? parseInt(req.params.marks) : 65;
    Interview.find({
        interview_marks: { $gte: marks }
    }).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_all_upcoming_interview = (req, res) => {
    Interview.find({
            interview_date: { $gte: Date.now() }
        }).populate({
            path: 'pInfo',
            populate: {
                path: 'application_title'
            }
        }).then(result => res.status(200).json(response_handler(result, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

// we need to run the helper.get_title middleware before this!!
exports.add_new_interview = (req, res) => {
    Interview.find({
        pInfo: req.body.pInfo
    }).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).where({
        'pInfo.application_title._id': req.application_title_id
    }).then(result => {
        if (result.length > 0)
            return res.status(400).json(response_handler(result, false, "Interview schedule already there"));
        Interview(req.body).save()
            .then(doc => res.status(200).json(response_handler(doc, true)))
            .catch(err => res.status(400).json(response_handler(err, false, "Interview can't be scheduled!")));
    }).catch(err => res.status(400).json(response_handler(err, false, "Interview can't be scheduled!")));
}

exports.bulk_Interview_saving = (req, res) => {
    // we can use insertMany();
    const qualified_applicants = req.body.interns; // this is an array of IDs - ref = Register!
    req.body.interns = undefined;
    let insert_data = [];
    qualified_applicants.forEach(id => {
        const newInterview = new Interview({...req.body, pInfo: id });
        insert_data.push(newInterview);
    });
    Interview.insertMany(insert_data, (err, doc) => {
        if (err)
            return res.status(304).json(response_handler(err, false, "Interview is not added"));
        return res.status(200).json(response_handler(doc, true, "Interview added successfully.."));
    });
}

exports.bulk_Interview_updating = (req, res) => {
    Interview.updateMany({
        pInfo: {
            $in: req.body.interns
        }
    }, {
        $set: {
            interview_date: req.body.interview_date,
            slot_details: req.body.slot_details,
            venue_details: req.body.venue_details
        }
    }, (err, doc) => {
        if (err)
            return res.status(304).json(response_handler(err, false, "Applications are not updated"));
        return res.status(200).json(response_handler(doc, true, "Applications updated successfully.."));
    });
}

exports.update = (req, res) => {
    const id = req.params.id;
    let body = req.body;
    Interview.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            interview: body.interview,
            interview_attendence: body.interview_attendence,
            interview_marks: body.interview_marks,
            interview_comment: body.interview_comment,
            interview_date: body.interview_date,
            slot_details: body.slot_details,
            venue_details: body.venue_details
        }
    }, (err, doc) => {
        if (err)
            return res.status(304).json(response_handler(err, false, "Applicant is not updated"));
        return res.status(200).json(response_handler(doc, true, "Application status updated successfully.."));
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Interview.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            isDeleted: true
        }
    }, (err, doc) => {
        if (err)
            return res.status(304).json(response_handler(err, false, "Interview is not Deleted"));
        return res.status(200).json(response_handler(doc, true, "Interview Deleted successfully.."));
    });
}