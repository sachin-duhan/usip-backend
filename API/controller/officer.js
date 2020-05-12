const Officer = require('../models/officer'),
    Intern = require('../models/intern'),
    response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all_officer = (req, res) => {
    Officer.find({
        active: true
    }).then(officer => {
        return res.status(200).json(response_handler({}, true, undefined, { officers: officer }));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.update_officer_details = (req, res) => {
    const id = req.params.id;
    Officer.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            deptt: req.body.deptt
        }
    }, (err, doc) => {
        if (err) return res.status(400).json(response_handler(err, false))
        return res.json(response_handler(doc, true, "officer updated successfully"));
    });
}

exports.get_all_interns_for_officer = (req, res) => {
    const id = req.params.id;
    Intern.find({
        repOfficer: id
    }).then(result => {
        return res.status(200).json({
            intern: result
        })
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.make_new_officer = (req, res) => {
    Officer.findOne({
        phone: req.body.phone
    }).then(result => {
        if (result) return res.status(400).json(response_handler(result, false, "Officer already exist"));
        else {
            newOfficer = new Officer(req.body);
            newOfficer.save().then(result => {
                res.status(200).json(response_handler({}, true, undefined, { officer: result }));
            }).catch(err => res.status(400).json(response_handler(err, false)));
        }
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.make_new_intern_and_assign_officer = (req, res) => {
    const id = req.params.id;
    const officer_id = req.body.officer_id;
    Intern.findOne({
        pInfo: id
    }).then(result => {
        if (result) return res.status(400).json(response_handler(result, false, "Intern already exist"))
        const newIntern = Intern({
            pInfo: id,
            depNo: req.body.depNo,
            bankName: 'Not filled',
            bankAc: id,
            ifsc: 'Not filled',
            start: req.body.start,
            end: req.body.end,
            repOfficer: officer_id
        });
        newIntern.save().then(intern => {
            res.status(200).json(response_handler({}, true, undefined, { intern: intern }));
        }).catch(err => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.make_officer_inactive = (req, res) => {
    const id = req.params.id;
    Officer.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            active: false
        }
    }, (err, doc) => {
        if (err) res.status(400).json(response_handler(err, false, "Officer can't be deleted!"));
        return res.json(response_handler(doc, true, "Officer deleted successfully"));
    });
}