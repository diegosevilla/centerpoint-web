import React from 'react';
import PropTypes from 'prop-types';
import { Table} from 'react-materialize';
import _ from 'lodash';
import styles from '../stylesheets/CreateSurvey.css';

class ResultTable extends React.Component {
  render(){
    const { questions, responses} = this.props;
    const header = [];
    const body = [];

    header.push(<th key='responseNum'> Response Number </th>);
    questions.forEach((q) => {
      header.push(<th key={q.label + '-' + q.id}> {q.label} </th>);
    });
    for(let key in responses){
      let temp = [];
      temp.push(<td key={'row-'+key}> {key} </td>);
      questions.forEach((q) => {
        let r = _.find(responses[key], function(r) { return r.question_id == q.id });
        if(r)
          temp.push(<td key={r.id}>{r.response}</td>);
        else
          temp.push(<td key={q.id+'-na'}>n/a</td>);
      });
      body.push(<tr key={key+'-row'}>{temp}</tr>);
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
    questions: PropTypes.array.isRequired,
    responses: PropTypes.object.isRequired
};

export default ResultTable;
