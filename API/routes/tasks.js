const express = require('express');
const router = express.Router();

const controller = require('../controller/tasks');

router.get('/', controller.get_all);

router.get('/:id', controller.get_specific);

router.get('/officer/:id',controller.get_all_tasks_added_by_an_officer);

router.put('/update/:id',controller.update_completiton_and_visibility);

router.post('/create', controller.make_new);

router.delete('/:id', controller.delete_task);

module.exports = router;