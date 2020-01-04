const express = require('express');
const router = express.Router();
const controller = require('../controller/bug');

router.get('/', controller.get_all_bugs);

router.delete('/:id', controller.delete_a_bug_using_id);

router.get('/:id', controller.get_specific_bug);

router.post('/', controller.make_new_bug);

module.exports = router;