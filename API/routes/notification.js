const express = require('express');
const router = express.Router();

const AWS_upload = require('../services/file_upload_aws');
const controller = require('../controller/notification');

router.get('/public', controller.get_public_notification);
router.get('/intern', controller.get_intern_notification);

router.post('/', (req, res, next) => {
    if (req.body.is_image == 'true')
        AWS_upload.single("image");
    else next();
}, controller.make_new_notification);

router.put('/update/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;