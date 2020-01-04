const express = require('express');
const router = express.Router();

const file = require('../helpers/file-upload');

router.get('/uploads/:name', file.get_report_file);

module.exports = router;