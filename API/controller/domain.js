const Domain = require('../models/domain');

exports.get_all_domains = (req, res) => {
    Domain.find({}).then(result => {
        if (result && result.length > 0) {
            res.json({
                domain: result
            });
        } else {
            res.json({
                message: 'No domain found!!'
            })
        }
    }).catch(err => {
        res.json({
            error: err
        });
    })
}

exports.delete = (req,res)=>{
    const id = req.params.id
    Domain.findOneAndDelete({_id:id},(err)=>{
        if(err){
            res.status(400).json({
            	message:'Domain cant be deleted',
            	error:err
            });
        }else{
            res.status(200).json({
            	message:'Domain Deleted'
            });
        }
    });
}

exports.make_new_domain =  (req, res) => {
    Domain.find({
        title: req.body.title
    }).then(result => {
        if (result && result.length > 0) {
            res.json({
                message: 'Domain already found'
            });
        } else {
                const newDomain = new Domain({
                    title: req.body.title
                });
                newDomain.save().then(result => {
                    res.status(200).json({
                    	message:'Domain added!',
                        status: result
                    });
                }).catch(err=>{
                	res.status(400).json({
                		error:err
                	});
                });
        }
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    })
}