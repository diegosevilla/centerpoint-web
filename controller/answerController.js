const db = require('../db') //this is required
const sequelize = require('sequelize');

const Op = sequelize.Op;
const Answer = require('../db/models/answer');
const Question = require('../db/models/question');

module.exports= {
  findAll: function(res, res, next){
    Answer.findAll({
      attributes:{ exclude: ['created_at', 'updated_at'] },
      order: [['question_id', 'ASC'], ['responseCount', 'ASC']]
    })
    .then( answers => {
      res.status(200).send(answers);
    })
    .catch((err)=>{
      res.status(500).send(err);
    })
  },

  findBySurvey: function(req, res, next){
    Question.findAll({
      attributes:['id', 'label'],
      where: {survey_id: req.params.surveyId},
    })
    .then((questions) =>{
      const array = questions.map(q => q.id);
      Answer.findAll({
        attributes:{ exclude: ['created_at', 'updated_at'] },
        where: {question_id: {[Op.in]: array}}
      })
      .then((answers)=>{
          res.status(200).send({questions, answers});
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    })
  },

  findByQuestion: function(req, res, next){
    Answer.findAll({
      where: {question_id: req.params.questionId},
      attributes:{ exclude: ['created_at', 'updated_at'] },
      order: [['responseCount', 'ASC']]
    })
    .then((answers) => {
        res.status(200).send(answers)
    }).catch((err) => {
      res.status(500).send(err);
    })
  },

  findByQuestionWithCount: function(req, res, next){
    Answer.findAll({
      where: {question_id: req.params.questionId},
      attributes: [['response','name'], [sequelize.fn('COUNT', sequelize.col('response')), 'count']],
      group: 'response',
      order: [['count', 'ASC'], ['response', 'ASC']]
    })
    .then((answers) => {
      res.status(200).send(answers)
    }).catch((err) => {
      res.status(500).send(err);
    })
  },

  create: function(req, res, next) {
    Question.findOne({where: {id: req.body.questionId}})
    .then(question => {
      if(question){
        question.createAnswer({
          response: req.body.response,
          responseCount: req.body.responseCount,
          location: req.body.location
      }).then((answer) => {
        res.status(200).send(answer);
      })
    } else {
      res.status(404).send();
    }
  }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  }
}
