const router = require('express').Router()
const surveyController =  require('../controller/surveyController');
router.get('/', surveyController.findAll);
router.get('/:id', surveyController.findOne);
router.get('/surveyId/:id', surveyController.findBySurveyID);
router.get('/author/:author', surveyController.findByAuthor);
router.post('/create', surveyController.create);
router.post('/update/:id', surveyController.update);
router.post('/cancel/:id', surveyController.cancel);
router.post('/increment/:id', surveyController.increment);

module.exports = router;
