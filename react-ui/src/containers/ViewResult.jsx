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
      active: '0',
      locations: [[''], [''], ['']],
      filter: {},
      demography: {}
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
            if(!r){
              answer.response = [answer.response];
              temp.push(answer);
            }
            else{
              r.response = _.concat(r.response, [answer.response]);
            }
          })
          let demo = _.filter(this.props.survey.questions, function(q){return q.questionType == 'Demographic';});
          let demography = {};

          demo.forEach((d) => { demography[d.id] = '' });

          let data = _.groupBy(temp, function(a){return a.responseCount});
          this.setState({isLoading: false, data, responses: tempAnswers, questions: responses.questions, locations: tempLoc, demography: demography });
        })
      }
    })
  }

  changeDemography(e, demo){
    e.preventDefault();
    let demography = {};

    demo.forEach((d) => {
      demography[d.id] = $('#filter-'+d.defaultValue).val();
    });

    this.setState({demography: demography});
  }

  render() {
    const { survey } = this.props;
    const { data, questions, isLoading, responses, demography, active} = this.state;
    let charts = [];
    let summary = [];
    let filter = [];

    let sortedQuestions = _.sortBy(this.props.survey.questions, (questions) => { return questions.id; });

    let demo = _.filter(sortedQuestions, (q) => {return q.questionType == 'Demographic';});

    demo.forEach((d) => {
      let temp = [];
      temp.push(<option key={'null-'+d.id} value=''> </option>);
      d.options.forEach((o) => {
        temp.push(<option key={o+'-'+d.id} value={o}>{o}</option>);
      })

      filter.push(
        <Input s={3} key={'input-'+d.id} required='true' onChange={(e) => this.changeDemography(e,demo)} id={'filter-'+ d.defaultValue} type='select' label={d.defaultValue} defaultValue=''>
          {temp}
        </Input>
      );
    });

    let res = [];
    for(let key in data){
      let temp = data[key];
      let r = {};
      r.responseCount = key;
      r.location = temp[0].location;
      temp.forEach((t) => {
        r[t.question_id] = t.response;
      })
      res.push(r);
    }

    let filteredRes = _.filter(res, (r) => {
      for(let i = 0 ; i < demo.length ; i++){
        let d = demo[i];
        if(demography[d.id] == '') continue;
        if(d.defaultValue == 'Age'){
          let start, end, temp = demography[d.id];
          if(temp.startsWith('Below')){
            start = 0;
            end = d.minVal;
          } else if(temp.startsWith('Above')){
            start = d.maxVal;
            end = Math.abs(Math.max());
          } else {
            let str = temp.split(' - ');
            start = parseInt(str[0]);
            end = parseInt(str[1])+1;
          }
          if(!_.inRange(r[d.id], start, end)) return false;
        } else if(r[d.id] != demography[d.id]) return false;
      }
      return true;
    })

    sortedQuestions.forEach((q) => {
      let chartData = [];
      filteredRes.forEach((response) => {
        let res = response[q.id];
        if(res){
          res.forEach((r) => {
            chartData.push({response: r})
          });
        }
      });
      if(q.questionType != 'Text'){
        chartData = _.filter(chartData, function(data){ return chartData });
        charts.push(
          <div key={q.id+'-chart'} style={{
            padding: '10px',
            width: '50%',
            marginLeft: '25%',
            marginRight: '25%',
            marginTop: '2%',
            marginBottom: '2%',
            height: '430px',
            backgroundColor: '#fcc2a1',
            textAlign: 'center'
          }} >
          <Chart key={q.id} question={q} chartData={chartData}/>
          </div>
        )
      }
    });

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
           <Row style={{paddingLeft: 50, paddingTop: 10}}>
           <h6> Filter By: </h6>
           {filter}
           </Row>
            <Tabs className='z-depth-1' onChange={(e) =>{this.setState({active: e+''})}}>
              <Tab title="Actual Responses" active={active.endsWith('0')}>
                <ResultTable key={'resultTable'} surveyId={survey.id} questions={sortedQuestions} responses={filteredRes} surveyTitle={survey.surveyName}/>
              </Tab>
              <Tab title="Charts & Graphs" active={active.endsWith('1')}>
                {charts}
              </Tab>
              <Tab title="Data Analysis" active={active.endsWith('2')}>
                <DataAnalysis key={'dataAnalysis'} responseCount={survey.responseCount} questions={sortedQuestions} responses={filteredRes} demography={demography}/>
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
