const express = require('express');
const router = express.Router();

const controller = require('../controller/report');
const IMG = require('../helpers/file-upload');

const helper = require('../helpers/title');

router.get('/', controller.get_all);

router.get('/:id', controller.get_single_specific);

router.get('/active', helper.get_title, controller.get_active_interns_report);

router.get('/intern/:id', controller.get_all_for_intern_reports);

router.post('/:id', IMG.upload.single('reportImage'), controller.make_new);

router.delete('/:id', controller.delete);

module.exports = router;