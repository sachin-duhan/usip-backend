const express = require('express');
const router = express.Router();

const controller = require('../controller/officer');

router.get('/', controller.get_all_officer);

router.get('/intern/:id', controller.get_all_interns_for_officer);

router.put('/update/:id', controller.update_officer_details);

router.post('/login', controller.login);

router.post('/create', controller.make_new_officer); //login

router.post('/signup', controller.make_new_officer_login_credentials);

router.put('/update_password/:id', controller.update_password);

router.post('/add/:id', controller.make_new_intern_and_assign_officer);

router.delete('/inactive/:id', controller.make_officer_inactive);

module.exports = router;