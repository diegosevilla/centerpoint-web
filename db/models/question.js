'use strict'

const Sequelize = require('sequelize')
const db = require('../index.js');

const Question = db.define('question', {
  label: {
  	type: Sequelize.DataTypes.TEXT,
  	allowNull: false,
  },
  questionType: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  minVal: {
    type: Sequelize.DataTypes.FLOAT,
    defaultValue: 0
  },
  maxVal: {
    type: Sequelize.DataTypes.FLOAT,
    defaultValue: 1
  },
  step: {
    type: Sequelize.DataTypes.FLOAT,
    defaultValue: 1
  },
  defaultValue: Sequelize.DataTypes.TEXT,
  required: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false
  },
  options: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.TEXT)
});

module.exports = Question;
