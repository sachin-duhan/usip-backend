const express = require('express');
const router = express.Router();

const controller = require('../controller/login');

router.post('/login', controller.login_user);

router.get('/signup', controller.get_all_users_with_access);

router.post('/signup', controller.make_new_user);

router.delete('/:id', controller.delete);

router.get('/:id', controller.get_specific_user);

router.put('/password/:id', controller.update_password);

module.exports = router;