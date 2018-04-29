const db = require('../db') //this is required
const sequelize = require('sequelize');

const Answer = require('../db/models/answer');
const Question = require('../db/models/question');

module.exports= {
  findAll: function(res, res, next){
    Answer.findAll()
    .then( answers => {
      res.status(200).send(answers);
    })
    .catch((err)=>{
      res.status(500).send(err);
    })
  },

  findByQuestion: function(req, res, next){
    Answer.findAll({
      where: {question_id: req.params.questionId},
      attributes: [['response','name'], [sequelize.fn('COUNT', sequelize.col('response')), 'value']],
      group: 'response'
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
