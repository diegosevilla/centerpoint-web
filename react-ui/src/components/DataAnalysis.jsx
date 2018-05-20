import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'react-materialize';
import _ from 'lodash';
import * as Sentiment from 'sentiment';

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
    let temp = {};
    let index = 1;
    let group = _.groupBy(responses, function(r) {return r.question_id});
    for(let key in group){
      let q = _.find(questions, function(q) {return q.id == key})
      let count = _.countBy(group[key], function(g){return g.response});
      let r = [];
      for (let k in count){
        r.push({response: k, count: count[k]})
      }
      temp[index] = {
        question: q,
        responses: r,
        max: _.maxBy(r, function(t){return t.count}),
        total: _.sumBy(r, function(t){return t.count})
      }
      index++;
    }
    this.setState({data: temp})
  }

  render(){
    const {data} = this.state;
    const {responseCount} = this.props;
    let analysis = [];
    let sentiment = new Sentiment();

    for(let key in data){
      let summary = '';
      let question = data[key].question;
      let total = data[key].total;
      let max = data[key].max;
      let percent = parseFloat((max.count/total)*100).toFixed(2);
      var result = sentiment.analyze(question.label);
      console.dir(question.label + ': ' + JSON.stringify(result));    // Score: -2, Comparative: -0.666
      var result = sentiment.analyze(max.response);
      console.dir(max.response + ': ' + JSON.stringify(result));    // Score: -2, Comparative: -0.666
      switch(question.questionType){
        case 'Options':
          summary += 'Majority (' +  percent + ') of the respondents asked answered ' + max.response + ' to the question \'' + question.label + '\'.';
          break;
        case 'Likert-Scale':
          summary += percent +'% ('+ max.count + ' out of ' + total + ') of the respondents answered ' + max.response.toLowerCase() + ' when asked the question ' + question.label +'.';
          break;
        case 'Checkbox':
          summary += 'Out of ' + responseCount + ' respondents, ' + max.count + ' selected ' + max.response + ' as answer to the question ' + question.label +'.'
          break;
        case 'Number':
          summary += 'this type of '
          break;
        default: break;
      }
      analysis.push(<p> {summary} </p>)
    }


    return(
      <div style={{width: '80%',height: 500, padding: 30, marginLeft: '10%', marginRight: '10%'}}>
        {analysis}
      </div>
    )
  }
}

DataAnalysis.propTypes = {
    responseCount: PropTypes.number.isRequired,
    questions: PropTypes.array.isRequired,
    responses: PropTypes.object.isRequired
};

export default DataAnalysis;
