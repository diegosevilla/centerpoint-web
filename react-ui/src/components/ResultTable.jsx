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

    responses.forEach((response) => {
      let temp = [];
      temp.push(<td key={'row-'+response.responseCount}> {response.responseCount} </td>);
      questions.forEach((q) => {
        let r = response[q.id];
        if(r)
          temp.push(<td key={q.id+'-'+response.responseCount}>{r.join(', ')}</td>);
        else
          temp.push(<td key={q.id+'-na'}>n/a</td>);
      });
      body.push(<tr key={response.responseCount+'-row'}>{temp}</tr>);
    })

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
    responses: PropTypes.array.isRequired
};

export default ResultTable;
