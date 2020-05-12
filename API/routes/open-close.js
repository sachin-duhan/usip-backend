const express = require('express');
const router = express.Router();

const controller = require('../controller/open-close');
const helper = require('../helpers/title');
const response_handler = require('../helpers/response_handler').send_formatted_reponse_handler;

router.get('/application', controller.get_application_status);

router.post('/application', controller.allow_application);

router.put('/application', controller.close_application);

router.get('/bank', controller.get_bank_status);

router.post('/bank', helper.get_title, controller.allow_bank);

router.put('/bank', controller.close_bank);

router.get('/application/all', controller.get_all_application);

router.get('/bank/all', controller.get_all_bank);

router.get('/title', helper.get_title,
    (req, res) => res.status(200).json(response_handler({}, true, undefined, { title: req.application_title })));

module.exports = router;