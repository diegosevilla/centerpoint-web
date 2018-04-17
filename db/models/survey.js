'use strict'

const Sequelize = require('sequelize')
const tokenify = require('sequelize-tokenify')
const db = require('../index.js');

const Survey = db.define('survey', {
    surveyName: Sequelize.TEXT,
    surveyId: {
      type: Sequelize.TEXT,
      unique: true
    }
});

tokenify.tokenify(Survey, {field: 'surveyId'});

module.exports = Survey;
