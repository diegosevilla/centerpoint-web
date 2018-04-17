const router = require('express').Router()
const surveyController =  require('../controller/surveyController');
router.get('/', surveyController.findAll);
router.get('/:id', surveyController.findOne);
router.post('/create', surveyController.create);
router.post('/update/:id', surveyController.update);
router.post('/cancel/:id', surveyController.cancel);

module.exports = router;
