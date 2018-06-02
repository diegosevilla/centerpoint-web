const api = module.exports = require('express').Router()
const survey = require('./survey');
const question = require('./question');
const answer = require('./answer');

api
  .use('/survey', survey)
  .use('/question', question)
  .use('/answer', answer);
api.use((req, res) => res.status(404).end())
