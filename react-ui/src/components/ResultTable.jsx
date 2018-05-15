import React from 'react';
import PropTypes from 'prop-types';
import { Table} from 'react-materialize';
import { ResponsivePie, ResponsiveBar,ResponsiveLine } from 'nivo';
import _ from 'lodash';
import Math from 'mathjs'
import styles from '../stylesheets/CreateSurvey.css';

class ResultTable extends React.Component {
  render(){
    const { questions, responses} = this.props;
    const header = [];
    const body = [];

    header.push(<th> Response Number </th>);
    questions.forEach((q) => {
      header.push(<th> {q.label} </th>);
    });
    for(let key in responses){
      let temp = [];
      temp.push(<td> {key} </td>);
      questions.forEach((q) => {
        let r = _.find(responses[key], function(r) { return r.question_id == q.id });
        temp.push(<td> {r? r.response: 'n/a'} </td>);
      });
      body.push(<tr> {temp} </tr>);
    }

    return(
      <div style={{backgroundColor: 'white', height: 500, padding: 10}}>
        <Table responsive={true} centered={true} bordered={true}>
          <thead>
            <tr>
              {header}
            </tr>
          </thead>
          <tbody>
            {body}
          </tbody>
        </Table>
      </div>
    )
  }
}

ResultTable.propTypes = {
    question: PropTypes.object.isRequired,
    responses: PropTypes.object.isRequired
};

export default ResultTable;
