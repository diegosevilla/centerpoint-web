'use strict';

const Question = require('./question');
const Survey = require('./survey');

Survey.hasMany(Question, {onDelete: 'cascade'});
Question.belongsTo(Survey);

module.exports = { Survey, Question};
