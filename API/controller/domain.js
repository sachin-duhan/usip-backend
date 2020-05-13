const Domain = require('../models/domain');
const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

exports.get_all_domains = (req, res) => {
    Domain.find({}).then(result => {
        return res.status(200).json(response_handler(result, true, undefined, { domain: result }));
    }).catch(err => {
        return res.json(response_handler(err, false, undefined, { domain: [] }));
    })
}

exports.delete = (req, res) => {
    const id = req.params.id
    Domain.findOneAndDelete({ _id: id }, (err) => {
        if (err)
            return res.status(400).json(response_handler(err, false, "Domain is not deleted"));
        return res.status(200).json(response_handler({}, true, 'Domain Deleted successfully'));
    });
}

exports.make_new_domain = (req, res) => {
    Domain.find({ title: req.body.title }).then(result => {
        if (result.length > 0)
            return res.status(400).json(response_handler(result, false, "Domain already found"));
        const newDomain = new Domain(req.body);
        newDomain.save().then(result => {
            return res.status(200).json(response_handler(result, true, "Domain added successfully", { status: result }));
        }).catch(err => res.status(400).json(response_handler(err, false)));
    }).catch(err => res.status(400).json(response_handler(err, false)));
}