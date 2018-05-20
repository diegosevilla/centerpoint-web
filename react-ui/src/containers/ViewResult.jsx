import React, {Component} from 'react';
import {PropTypes}  from 'prop-types';
import {Button, Row, Col, Input, Preloader, Tabs, Tab, Pagination} from 'react-materialize';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../stylesheets/CreateSurvey.css';
import Chart from '../components/Chart';
import ResultTable from '../components/ResultTable';
import DataAnalysis from '../components/DataAnalysis';
import { fetchSurvey } from '../actions/index';

const $ = window.$;

class ViewResult extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {},
      responses: [],
      questions: [],
      active: 0,
      locations: [[''], [''], ['']],
      filter: {0: '', 1: '', 2: ''}
    };
  }

  componentDidMount(){
    let id = window.location.pathname.replace(/\/view-result\//, '');
    this.props.fetchSurvey(id)
    .then(()=>{
      if(this.props.survey.id === -1){
        alert('Invalid Survey!');
        window.location = '/';
      } else {
        fetch('/api/answer/survey/'+id)
        .then((res) => res.json())
        .then((responses) => {
          let temp = [];
          let tempAnswers = responses.answers;
          let tempLoc = [[''], [''], ['']];
          tempAnswers.forEach((answer) => {
            let loc = answer.location.split(',');
            for(let i = 0 ; i < 3 ; i++){
              if(!_.includes(tempLoc[i], loc[i]))
                tempLoc[i].push(loc[i]);
            }
            let r = _.find(temp, {responseCount: answer.responseCount, question_id: answer.question_id});
            if(!r)
              temp.push(answer);
            else{
              r.response += ', ' + answer.response
            }
          })

          let data = _.groupBy(temp, function(a){return a.responseCount});
          this.setState({isLoading: false, data, responses: tempAnswers, questions: responses.questions, locations: tempLoc });
        })
      }
    })
  }

  render() {
    const { survey } = this.props;
    const { data, questions, isLoading, responses } = this.state;
    let charts = [];
    let summary = [];

    let sortedQuestions = _.sortBy(this.props.survey.questions, (questions) => {
         return questions.id;
     });

    sortedQuestions.forEach((q) => {
      let chartData = _.filter(responses, ['question_id', q.id]);
      charts.push(
        <div key={q.id+'-chart'} style={{
          padding: '10px',
          width: '50%',
          marginLeft: '25%',
          marginRight: '25%',
          marginTop: '2%',
          marginBottom: '2%',
          height: '550px',
          backgroundColor: '#fcc2a1',
          textAlign: 'center'
        }} >
          <Chart key={q.id} question={q} chartData={chartData}/>
        </div>
      )
    })

    if(isLoading)
      return(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
            <Preloader size='big'/>
            <h1> Fetching Results </h1>
        </Row>
      )
    else
    return(
      <div className='bgCS'>
        <div>
          <div className="resultHeader center ">
              <div className="home center">
                <Button floating large className='teal darken-2' waves='light' icon='home' onClick={(e) => {e.preventDefault() ; window.location = '/user'}}/>
              </div>
              <br/>
              <div className="resultTitle center">
                <h4> {survey.surveyName} </h4>
                <h5> {'By: ' + survey.author} </h5>
              </div>
          </div>
         <Row className="resultBody">
            <Tabs className='z-depth-1'>
              <Tab title="Actual Responses" active>
                <ResultTable key={'resultTable'} questions={sortedQuestions} responses={data}/>
              </Tab>
              <Tab title="Charts & Graphs">
                {charts}
              </Tab>
              <Tab title="Data Analysis">
                <DataAnalysis key={'dataAnalysis'} responseCount={survey.responseCount} questions={sortedQuestions} responses={responses}/>
              </Tab>
            </Tabs>
         </Row>
        </div>
      </div>
    )
  }
}

ViewResult.propTypes = {
    survey: PropTypes.object.isRequired,
    fetchSurvey: PropTypes.func.isRequired,
};
export default connect(
    state => ({ survey: state.survey }),
    { fetchSurvey }
)(ViewResult);
