const db = require('../db') //this is required

const Survey = require('../db/models/survey');
const Question = require('../db/models/question');

module.exports= {
  findAll: function(req, res, next) {
    Survey.findAll({include: [Question]})
    .then(result => {
        res.status(200).send(result);
    })
    .catch(next);
  },

  findOne: function(req, res, next){
    Survey.find({ where: {id:req.params.id}, include: [Question]})
    .then((survey) => {
      if(!survey) res.status(404).send({id:-1});
      else {
        res.status(200).send(survey)
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  },

  create: function(req, res, next) {
    Survey.create({surveyName: req.body.surveyName})
    .then((survey) => {
      res.status(200).send(survey);
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  },

  update: function(req, res, next){
    Survey.findOne({where: {id: req.params.id}})
    .then((survey) => {
      if(survey){
        survey.update({surveyName: req.body.surveyName})
        .then((updatedSurvey) => {
          res.status(200).send(survey);
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

  cancel: function(req, res, next){
    Survey.findOne({where: {id: req.params.id}})
    .then((survey) => {
      if(survey){
        survey.destroy()
        .then(() => {
          res.status(200).send();
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
