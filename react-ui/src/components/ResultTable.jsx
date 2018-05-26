import React from 'react';
import PropTypes from 'prop-types';
import { Table} from 'react-materialize';
import _ from 'lodash';
import ReactTable from 'react-table'
import "react-table/react-table.css";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import styles from '../stylesheets/CreateSurvey.css';

class ResultTable extends React.Component {
  render(){
    const { questions, responses, surveyTitle, surveyId} = this.props;
    const header = [];
    const body = [];

    header.push(<th key='responseNum'> Response Number </th>);
    questions.forEach((q) => {
      header.push(<th key={q.label + '-' + q.id}> {q.questionType == 'Demographic'? q.defaultValue :  q.label} </th>);
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

    const data = responses.map((response) => {
      let temp = {};
      for(let key in response){
        if(/^\d+$/.test(key)){
          temp[key+''] = response[key].join(', ');
        } else if(key == 'responseCount'){
          temp[key] = response[key];
        }
      }
      return temp;
    });

    let columns = [{Header: 'Response Number', accessor: 'responseCount'}]
    questions.forEach((question) => {
      let header = question.questionType == 'Demographic'? question.defaultValue : question.label;
      columns.push({
        Header: header,
        accessor: question.id+''
      });
    })

    return(
      <div style={{backgroundColor: 'white', height: 500, padding: 10}}>
        <ReactHTMLTableToExcel className="download-table-xls-button" table="table-to-xls" filename={surveyTitle+' Results'} sheet="tablexls" buttonText="Download Result Table"/>
        <table id="table-to-xls" hidden>
          <tr>
            {header}
          </tr>
          {body}
        </table>
        <ReactTable data={data} columns={columns} defaultPageSize={10} className="-striped -highlight" sortable={false}/>
      </div>
    )
  }
}

ResultTable.propTypes = {
    questions: PropTypes.array.isRequired,
    responses: PropTypes.array.isRequired,
    surveyId: PropTypes.number.isRequired
};

export default ResultTable;
