const express = require('express');
const router = express.Router();

const controller = require('../controller/tasks');

router.get('/', controller.get_all);

router.get('/:id', controller.get_specific);

router.post('/create', controller.make_new);

router.delete('/:id', controller.delete_task);

module.exports = router;