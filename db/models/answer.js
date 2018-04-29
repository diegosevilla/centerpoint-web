'use strict'

const Sequelize = require('sequelize')
const db = require('../index.js');

const Answer = db.define('answer', {
  response: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Answer;
