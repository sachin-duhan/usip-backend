const express = require('express');
const router = express.Router();

const controller = require('../controller/notification');

router.get('/public', controller.get_public_notification);
router.get('/intern', controller.get_intern_notification);
router.post('/', controller.make_new_notification); // add a middleware for updloading files!!
router.put('/update/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;