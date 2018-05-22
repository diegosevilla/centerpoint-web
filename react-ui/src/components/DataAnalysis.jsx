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
    let data = [];
    questions.forEach((question) => {
      let group = [];
      responses.forEach((response) => {
        let res = response[question.id];
        res.forEach((r) => {
          group.push({response: r});
        })
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
        total: _.sumBy(r, function(t){return t.count})
      }
      data.push(temp);
    });
    this.setState({data: data})
  }

  render(){
    const {data} = this.state;
    const {responseCount} = this.props;
    let analysis = [];
    let sentiment = new Sentiment();

    console.log(data);
    for(let i = 0 ; i < data.length ; i++){
      let d = data[i];
      let summary = '';
      let question = d.question;
      let total = responseCount
      let max = d.max;
      if(d.total == 0) continue;
      let percent = parseFloat((max.count/total)*100).toFixed(2);

      switch(question.questionType){
        case 'Options':
          summary += 'Majority (' +  percent + ') of the respondents asked answered ' + max.response + ' to the question \'' + question.label + '\'.';
          break;
        case 'Likert-Scale':
          summary += percent +'% ('+ max.count + ' out of ' + total + ') of the respondents answered ' + max.response + ' when asked the question ' + question.label +'.';
          break;
        case 'Checkbox':
          summary += 'Out of ' + total  + ' respondents, ' + max.count + ' selected ' + max.response + ' as answer to the question ' + question.label +'.'
          break;
        case 'Number':
          summary += 'this type of '
          break;
        default: break;
      }
      analysis.push(<p> {summary} </p>)
    };

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
    responses: PropTypes.array.isRequired
};

export default DataAnalysis;