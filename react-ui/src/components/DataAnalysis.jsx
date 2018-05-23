import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'react-materialize';
import _ from 'lodash';
import * as Sentiment from 'sentiment';
import Math from 'mathjs';

import styles from '../stylesheets/CreateSurvey.css';

class DataAnalysis extends React.Component {
  constructor(props){
    super(props);
      this.state={
        data: {}
      }
  }

  componentDidMount(){
    const { questions, responses} = this.props;
    let data = [];
    questions.forEach((question) => {
      let group = [];
      responses.forEach((response) => {
        let res = response[question.id];
        if(res){
          res.forEach((r) => {
            group.push({response: r});
          });
        }
      });

      group = _.filter(group, (r) => { return r.response});
      let count = _.countBy(group, (r) => { return r.response});
      let r = [];
      for (let k in count){
        r.push({response: k, count: count[k]})
      }
      let temp = {
        question: question,
        responses: r,
        max: _.maxBy(r, function(t){return t.count}),
        total: _.sumBy(r, (t) => {return t.count}),
        score: this.getScore(r, question)
      }
      data.push(temp);
    });
    this.setState({data: data})
  }

  getScore(responses, question){
    let score = 0.0;
    if(question.questionType == 'Likert-Scale'){
      let total = 0;
      responses.forEach((r) => {
        score += (r.count*(question.options.indexOf(r.response)+1));
        total += r.count;
      });
      if(total > 0)
        score = parseFloat(score / (total*5)).toFixed(4);
    } else if(question.questionType == 'Text'){
      let sentiment = new Sentiment();
      responses.forEach((res) => {
        var result = sentiment.analyze(res.response);
        console.log(result);
        score += result.score;
      })
      score = 0
    }
    return score;
  }

  getAnalysis(score, totalScore){
    let percent = score/totalScore*100;
    if(_.inRange(percent, 0, 50))
      return ' received a negative score.'
    if(_.inRange(percent, 50, 60))
      return ' received a neutral score.'
    if(_.inRange(percent, 60, 100))
      return ' received a positive score.'
  }

  getStatistics(responses, question){
    let stat = '';
    let res = [];
    responses.forEach((r) => {
      let temp = r[question.id];
      if(temp){
        temp.forEach((t) => {
          res.push(question.options.indexOf(t)+1);
        })
      }
    })

    let mode = Math.mode(res).map((m) => {return question.options[m-1]});
    let op = (mode.length > 1)? ' options ' : 'option';

    stat += 'The question scored an average of ' + Math.mean(res).toFixed(4) + '.';
    stat += ' While the median of the responses is ' + Math.median(res) +'.';
    stat += ' The ' + op + ' ' + mode.join(', ') + ((mode.length > 1)? ' were ' : ' was ') + 'the most selected ' + op + '.';
    return stat;
  }

  render(){
    const {data} = this.state;
    const {responses, demography, questions} = this.props;
    let analysis = [];
    let parameters = '';

    for(let key in demography){
      if(demography[key] == '') continue;
      let question = _.find(questions, (q) => {
        return q.id == key;
      })
      if(!question)
        continue;
      if(parameters == '')
        parameters += 'Given the parameters ';
      parameters+= question.defaultValue + ' is ' + demography[key] + ', ';
    }
    if(parameters != '')
      parameters +=  ' the following results can be observed:'

    for(let i = 0 ; i < data.length ; i++){
      let d = data[i];
      if(!d) continue;
      let summary = '';
      let question = d.question;
      let total = d.total;
      let max = d.max;
      if(total == 0) continue;
      let percent = parseFloat((max.count/total)*100).toFixed(2);

      switch(question.questionType){
        case 'Options':
          summary += 'Majority (' +  percent + ') of the respondents asked answered ' + max.response + ' to the question \'' + question.label + '\'. ';
          break;
        case 'Likert-Scale':
          summary += ' On a ' + question.options.length + ' point Likert Scale, ' + this.getStatistics(responses, question);
          break;
        case 'Checkbox':
          summary += 'Out of ' + responses.length  + ' respondents, ' + max.count + ' selected ' + max.response + ' as answer to the question \'' + question.label +'\'.'
          break;
        case 'Number':
          summary += this.getStatistics(responses, question);
          break;
        case 'Text':
          let sentiment = '';
          if(d.score < 0)
            sentiment += ' negative ';
          else if(d.score ==0)
            sentiment += ' neutral ';
          else
            sentiment += ' positive '
          summary += 'The question \'' + question.label + '\' received mostly' + sentiment + ' results';
        default: break;
      }
      analysis.push(<p key={question.id+'-summary'}> {summary} </p>)
    };

    return(
      <div style={{width: '80%',height: 500, padding: 30, marginLeft: '10%', marginRight: '10%'}}>
        <h5> {parameters} </h5>
        {analysis}
      </div>
    )
  }
}

DataAnalysis.propTypes = {
    responseCount: PropTypes.number.isRequired,
    questions: PropTypes.array.isRequired,
    responses: PropTypes.array.isRequired,
    demography: PropTypes.object
};

export default DataAnalysis;
