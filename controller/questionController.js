const db = require('../db') //this is required

const Survey = require('../db/models/survey');
const Question = require('../db/models/question');

module.exports= {
  findAll: function(req, res, next) {
    Question.findAll()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(next);
  },

  findOne: function(req, res, next){
    Question.find({ where: {id:req.params.id}})
    .then((question) => {
      if(!question) res.status(404).send({message: 'Not found'})
      else {
        res.status(200).send(question)
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  },

  create: function(req, res, next) {
    console.log('>>>>>>>>>>>.' + req.body.id);
    Survey.findOne({where: {id: req.body.id}})
    .then(survey => {
      if(survey){
        survey.createQuestion({
          label: req.body.label,
          questionType: req.body.type,
          minVal: req.body.minVal,
          maxVal: req.body.maxVal,
          step: req.body.step,
          defaultValue: req.body.defaultValue,
          required: req.body.required,
          options: req.body.options
      }).then((question) => {
        res.status(200).send(question);
      })
    } else {
      res.status(404).send();
    }
  }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  },

  update: function(req, res, next){
    Question.findOne({where: {id: req.params.id}})
    .then((question) => {
      if(question){
        question.update({
          label: req.body.label,
          minVal: req.body.minVal,
          maxVal: req.body.maxVal,
          step: req.body.step,
          defaultValue: req.body.defaultValue,
          required: req.body.required,
          options: req.body.options
        })
        .then((updatedQuestion) => {
          res.status(200).send(updatedQuestion);
        })
      } else {
        res.status(404).send();
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send(err);
    })
  },

  remove: function(req, res, next){
    Question.findOne({where: {id: req.params.id}})
    .then((question) => {
      if(question){
        const surveyId = question.survey_id;
        question.destroy()
        .then(() => {
          res.status(200).send({surveyId: surveyId});
        })
      } else
        res.status(404).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  }

}
