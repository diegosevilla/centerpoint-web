'use strict'

const Sequelize = require('sequelize')
const db = require('../index.js');

const Answer = db.define('answer', {
  response: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false
  },
  responseCount: {
    type: Sequelize.DataTypes.INTEGER
  }
  location: {
    type: Sequelize.DataTypes.TEXT,
  }
});

module.exports = Answer;
