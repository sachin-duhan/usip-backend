const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const fileFilter = (req, file, cb) => {
    if (req.mimetype === 'image/jpeg' || req.mimetype === 'image/png' || req.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('file should be JPEG, JPG,PNG only'), false);
    }
};

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
        fileFilter: fileFilter
    }
});

exports.get_report_file = (req, res, next) => {
    var options = {
        root: path.join(__dirname, '..', '..', 'uploads'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    var fileName = req.params.name;
    res.sendFile(fileName, options, function(err) {
        if (err) {
            res.status(404).json({
                error: err
            });
        }
    })
}