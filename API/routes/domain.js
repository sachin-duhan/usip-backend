const express = require('express');
const router = express.Router();

const controller = require('../controller/domain')

router.get('/', controller.get_all_domains);

router.post('/', controller.make_new_domain);

router.delete('/:id', controller.delete);

module.exports = router;