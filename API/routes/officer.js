const express = require('express');
const router = express.Router();

const controller = require('../controller/officer');

router.get('/', controller.get_all_officer);

router.get('/intern/:id', controller.get_all_interns_for_officer);

router.put('/update/:id', controller.update_officer_details);

router.post('/create', controller.make_new_officer);

router.post('/add/:id', controller.make_new_intern_and_assign_officer);

router.delete('/inactive/:id', controller.make_officer_inactive);

module.exports = router;