const express = require('express');
const router = express.Router();

const controller = require('../controller/intern');
const helper = require('../helpers/title');

router.get('/', controller.get_all_qualified);

router.get('/register', controller.get_all_registered_interns);

router.post('/register', controller.make_new);

router.delete('/register/:id', controller.delete);

router.put('/register/:id', controller.update_bank_details);

router.put('/bank/:id', controller.update_bank_details);

router.get('/active/intern', helper.get_title, controller.get_current_active_interns);

router.get('/register/:id', controller.get_specific_registered_interns);

router.get('/officer/:id', controller.get_all_interns_for_an_officer);

router.get('/:id', controller.get_specific_qualified_intern);

module.exports = router;