const express = require('express');
const router = express.Router();

const controller = require('../controller/interview');
const helper = require('../helpers/title');

router.get('/all', controller.get_all_interview_list);
router.get('/marks/:marks',controller.get_query_based_interview_list);
router.get('/upcoming', controller.get_all_upcoming_interview);
router.post('/', helper.get_title, controller.add_new_interview);
router.post('/bulk', helper.get_title, controller.bulk_Interview_saving);
router.put('/update/bulk', controller.bulk_Interview_updating);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;