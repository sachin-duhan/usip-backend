const express = require('express');
const router = express.Router();

const helper = require('../helpers/title');
const controller = require('../controller/register');

router.get('/', controller.get_all_resgiterations);

router.post('/', helper.get_title, controller.make_new_application);

router.put('/qualify/:id', controller.qualify_an_intern);

router.get('/:id', controller.get_specific_regsiter);

router.delete('/:id', controller.delete);

module.exports = router;