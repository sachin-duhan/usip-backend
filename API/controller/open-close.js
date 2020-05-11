const Status = require('../models/open-close');
const help = require('../helpers/title');

exports.allow_bank = (req, res) => {
    Status.find({
        title: 'Allow bank details',
        isOpen: true
    }).then(result => {
        if (result.length > 0) {
            res.json({
                message: 'Application already open'
            });
        } else {
            const date = new Date();
            if (date > req.body.end) {
                res.status(400).json({
                    message: 'End time has to be later'
                })
            } else {
                const newApplication = new Status({
                    title: 'Allow bank details',
                    details: req.application_title, // set using the middleware function!
                    end: req.body.end,
                    isOpen: true
                });
                newApplication.save().then(result => {
                    res.json({
                        message: 'bank application allowed',
                        status: result
                    });
                }).catch(err => {
                    res.json({
                        error: err
                    });
                })
            }
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    })
}

exports.get_all_bank = (req, res) => {
    Status.find({
        title: 'Allow bank details'
    }).sort({
        Start: 'desc'
    }).then(result => {
        return res.status(200).json({
            bank: result
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    })
}

exports.get_all_application = (req, res) => {
    Status.find({
        title: 'Allow USIP intern application'
    }).sort({
        Start: 'desc'
    }).then(result => {
        return res.status(200).json({
            application: result
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    })
}

exports.close_bank = (req, res) => {
    Status.updateMany({
        title: 'Allow bank details',
        isOpen: true,
    }, {
        $set: {
            isOpen: false
        }
    }, (err) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else {
            res.status(200).json({
                message: 'bank applications closed'
            });
        }
    });
}

exports.get_bank_status = (req, res) => {
    Status.find({
        title: 'Allow bank details',
        isOpen: true
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                status: true
            })
        } else {
            res.status(200).json({
                status: false
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
}

exports.allow_application = (req, res) => {
    Status.find({
        title: 'Allow USIP intern application',
        isOpen: true
    }).then(result => {
        if (result.length > 0) {
            res.json({
                message: 'Application already open'
            });
        } else {
            const date = new Date();
            if (date > req.body.end) {
                res.json({
                    message: 'End time has to be later'
                });
            } else {
                const newApplication = new Status({
                    title: 'Allow USIP intern application',
                    end: req.body.end,
                    details: req.body.details,
                    isOpen: true
                });
                newApplication.save().then(result => {
                    res.json({
                        message: 'application opened!',
                        status: result
                    });
                });
            }
        }
    }).catch(err => {
        res.json({
            error: err
        });
    })
}

exports.close_application = (req, res) => {
    Status.updateMany({
        title: 'Allow USIP intern application',
        isOpen: true,
    }, {
        $set: {
            isOpen: false
        }
    }, (err) => {
        if (err) {
            res.json({
                status: result
            });
        } else {
            res.json({
                message: 'Aapplications closed'
            });
        }
    });
}

exports.get_application_status = (req, res) => {
    Status.find({
        title: 'Allow USIP intern application',
        isOpen: true
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                status: true
            })
        } else {
            res.status(200).json({
                status: false
            });
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
}

exports.get_current_application_title = (req, res, next) => {
    Status.find({
        title: 'Allow USIP intern application'
    }).sort({
        Start: 'desc'
    }).then(result => {
        if (result.length > 0) {
            return res.status(200).json({
                title: result[0].details
            });
        } else {
            return res.status(404).json({
                message: "no title found!"
            })
        }
    }).catch(err => {
        return res.status(400).json({
            message: 'some error happened!',
            error: err
        });
    });
}