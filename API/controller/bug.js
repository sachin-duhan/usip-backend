const Bug = require('../models/bug');

exports.get_all_bugs = (req,res)=>{
    Bug.find({})
    .sort({date:-1})
    .populate('pInfo')
    .then(result =>{
        if(result){
            res.json({
                message:'Contact Developers!!',
                bugs:result
            })
        }else{
            res.json({
                message:'Whooooo!! No bugs found '
            })
        }
    }).catch(err=>{
        res.json({
            error:err
        })
    })
}
exports.delete_a_bug_using_id = (req, res) => {
    const id = req.params.id;
    Bug.findOneAndDelete({
        _id: id
    }).then(result => {
        res.status(200).json({
            message: 'Bug Deleted!'
        });
    }).catch(err => {
        res.status(501).json({
            error: err
        });
    })
}

exports.get_specific_bug = (req, res) => {
    //id should be the intern id
    Bug.findOne({
        pInfo: req.params.id
    }).then(result => {
        res.json({
            bugs: result
        });
    }).catch(err => {
        res.json({
            error: err
        })
    })
}

exports.make_new_bug = (req, res) => {
    Bug.findOne({
            title: req.body.title
        })
        .sort({
            date: -1
        })
        .then(result => {
            if (result) {
                res.status(404).json({
                    message: 'already registered'
                });
            } else {
                const newBug = new Bug({
                    title: req.body.title,
                    description: req.body.details,
                    pInfo: req.body.pInfo
                });
                newBug.save().then(result => {
                    res.json({
                        message: 'Thank you for helping us!!'
                    });
                }).catch(err => {
                    res.json({
                        error: err
                    })
                });
            }
        }).catch(err => {
            res.json({
                error: err
            })
        })
}