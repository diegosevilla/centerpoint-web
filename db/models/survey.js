'use strict'

const Sequelize = require('sequelize')
const tokenify = require('sequelize-tokenify')
const db = require('../index.js');

const Survey = db.define('survey', {
    surveyName: Sequelize.TEXT,
    author: Sequelize.TEXT,
    surveyId: {
      type: Sequelize.TEXT,
      unique: true
    },
    details: Sequelize.TEXT
});

tokenify.tokenify(Survey, {field: 'surveyId'});

module.exports = Survey;
