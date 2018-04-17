const router = require('express').Router()
const questionController =  require('../controller/questionController');

router.get('/', questionController.findAll);
router.get('/:id', questionController.findOne);
router.post('/create', questionController.create);
router.post('/update/:id', questionController.update);
router.post('/remove/:id', questionController.remove);

module.exports = router;
