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
    details: Sequelize.TEXT,
    responseCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
});

tokenify.tokenify(Survey, {field: 'surveyId'});

module.exports = Survey;
