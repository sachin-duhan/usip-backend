const Report = require('../models/report');

exports.get_all = (req, res) => {
    Report.find({}).populate({
        path:'intern',
        populate:{
            path:'pInfo'
        }
    }).then(report => {
        res.status(200).json({
            reports: report
        })
    }).catch(err => {
        res.status(400).json({
            message: 'Error in finding the reports!',
            error: err
        });
    });

}

exports.get_active_interns_report = (req,res)=>{
    
}
exports.make_new = (req, res) => {
    const id = req.params.id; // user Id who is uploading the image!!
    Report.find({
        intern: id,
        start: req.body.start,
        end: req.body.end
    }).then(result => {
        if (result && result.length > 0) {
            res.status(400).json({
                message: 'Report Exist!!'
            });
        } else {
            const report = Report({
                intern: id, // connecting intern schema!!
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
                reportImage: req.file.path
            });
            report.save().then(result => {
                res.status(200).json({
                    message: 'your report have been uploded',
                    report: result
                })
            }).catch(err => {
                console.log(err);
            });
        }
    }).catch(err => {
        res.status(404).json({
            error: err
        });
    })
}

exports.delete = (req, res) => {
    Report.findOneAndDelete({
        _id: req.params.id
    }, (err) => {
        if (err) {
            res.status(404).json({
                error: err
            });
        } else {
            res.json({
                message: 'report Deleted!'
            });
        }
    });

}

exports.get_single_specific = (req, res) => {
    Report.find({
        _id: req.params.id
    }).populate({
        path: 'intern',
        populate: {
            path: 'pInfo'
        }
    }).then(report => {
        if (report) {
            res.json({
                reports: report
            });
        } else {
            res.json({
                message: 'No reports submiited'
            })
        }
    }).catch(err => {
        res.status(400).json({
            message: 'Error in finding the reports!',
            error: err
        });
    });

}

exports.get_all_for_intern = (req, res) => {
    Report.find({
        intern: req.params.id
    }).populate({
        path:'intern',
        populate:{
            path:'pInfo'
        }
    }).then(report => {
        res.json({
            reports: report
        });
    }).catch(err => {
        res.status(400).json({
            message: 'Error in finding the reports!',
            error: err
        });
    });

}