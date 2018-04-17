const api = module.exports = require('express').Router()
const survey = require('./survey');
const question = require('./question');

// import products from './products';
api
  .use('/survey', survey)
  .use('/question', question);
// No routes matched? 404.
api.use((req, res) => res.status(404).end())
