const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const keys = require('../../config/keys');

const s3Config = new aws.S3({
    accessKeyId: keys.AWS_ACCESS_KEY,
    region: keys.AWS_REGION,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
    limits: {
        fileSize: 1024 * 1024
    },
    storage: multerS3({
        s3: s3Config,
        bucket: keys.S3_BUCKET_NAME,
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {
                fieldName: file.originalname
            })
        },
        key: function(req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname)
        }
    })
});

module.exports = upload;