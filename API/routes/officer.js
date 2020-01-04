const express = require('express');
const router = express.Router();

const controller = require('../controller/officer');

router.get('/', controller.get_all_officer);

router.post('/create', controller.create);

router.put('/add/:id', controller.update);

router.delete('/remove/:id', controller.delete_a_specific_intern);

router.delete('/delete/:id', controller.delete_an_officer);

module.exports = router;