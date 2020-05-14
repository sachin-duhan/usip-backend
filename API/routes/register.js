const express = require('express'),
    router = express.Router(),
    Period = require('../controller/open-close'),
    helper = require('../helpers/title'),
    controller = require('../controller/register');

// everything is perfect!! 
// {application_title: query} is not working for getting ongoing application!

router.get('/', controller.get_all_resgiterations);

router.get('/current', helper.get_title, controller.get_current_active_applications);

router.get('/qualified', controller.get_all_qualified_students);

router.get('/:id', controller.get_specific_regsiter);

router.post('/', Period.get_application_status, helper.get_title, controller.make_new_application);

router.put('/qualify/bulk', controller.qualify_intern_in_bulk);

router.put('/qualify/single/:id', controller.qualify_an_intern);

router.put('/disqualify/:id', controller.disqualify_an_intern);

router.delete('/:id', controller.delete);

module.exports = router;