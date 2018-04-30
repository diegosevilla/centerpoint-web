const router = require('express').Router()
const answerController =  require('../controller/answerController');

router.get('/', answerController.findAll);
router.get('/:questionId', answerController.findByQuestion);
router.post('/create', answerController.create);

module.exports = router;