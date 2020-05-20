const Intern = require('../models/intern');
const Register = require('../models/register');

const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

// making a new intern and assigning of new intern takes place in the officer controller
// i donn know why!!

exports.get_all_qualified = (req, res) => {
    Register.find({
        isQualified: true
    }).populate('application_title').then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

// params must contain officer id!!
exports.get_all_interns_for_an_officer = (req, res) => {
    Intern.find({ repOfficer: req.params.id })
        .then(doc => res.status(200).json(response_handler(doc, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_specific_qualified_intern = (req, res) => {
    const id = req.params.id; // regsiteration ID of the Intern
    Register.findOne({
        isQualified: true,
        _id: id
    }).populate('application_title').then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => res.status(400).json(response_handler(err, false)))
}

exports.get_all_registered_interns = (req, res) => {
    Intern.find({}).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).populate('repOfficer').then(result => {
        return res.status(200).json(response_handler(result, true));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_current_active_interns = (req, res) => {
    Intern.find({}).populate({
            path: 'pInfo',
            populate: {
                path: 'application_title'
            }
        }).populate('repOfficer')
        .where({ 'pInfo.application_title._id': req.application_title_id })
        .then(doc => res.status(200).json(response_handler(doc, true)))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.get_specific_registered_interns = (req, res) => {
    const id = req.params.id;
    Intern.findOne({ _id: id }).populate({
            path: 'pInfo',
            populate: {
                path: 'application_title'
            }
        }).populate('repOfficer')
        .then(intern => res.status(200).json(intern, false, "", { intern: intern }))
        .catch(err => res.status(400).json(response_handler(err, false)));
}

exports.make_new = (req, res) => {
    Intern.findOne({ // this is just for finding some duplicate entry!
        pInfo: req.body.id
    }).populate({
        path: 'pInfo',
        populate: {
            path: 'application_title'
        }
    }).populate('repOfficer').then(intern => {
        if (intern)
            return res.status(406).json(response_handler(intern, false, "Deployment No. is already resgistered"));
        const newIntern = new Intern(req.body);
        newIntern.save().then(intern => res.status(200).json(response_handler(intern, true, "Intern saved successfully")))
            .catch((err) => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Intern.findOneAndUpdate({ _id: id }, {
        $set: {
            isDeleted: true
        }
    }, (err, doc) => {
        if (err)
            return res.status(304).json(response_handler(err, false, "Bank Intern are not Deleted"));
        return res.status(200).json(response_handler(doc, true, "Intern Deleted successfully.."));
    });
}

exports.update_bank_details = (req, res) => {
    const id = req.params.id;
    Intern.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            bankAc: req.body.bankAc,
            ifsc: req.body.ifsc,
            bankName: req.body.bankName
        }
    }, (err, doc) => {
        if (err)
            return res.status(304).json(response_handler(err, false, "Bank details are not updated"));
        return res.status(200).json(response_handler(doc, true, "Bank details updated successfully.."));
    });
}