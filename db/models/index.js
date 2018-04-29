'use strict';

const Question = require('./question');
const Survey = require('./survey');
const Answer = require('./answer');

Survey.hasMany(Question, {onDelete: 'cascade'});
Question.belongsTo(Survey);

Question.hasMany(Answer, {onDelete: 'cascade'});
Answer.belongsTo(Question);

module.exports = { Survey, Question, Answer};
