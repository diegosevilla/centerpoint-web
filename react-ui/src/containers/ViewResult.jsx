import React, {Component} from 'react';
import {PropTypes}  from 'prop-types';
import {Button, Row, Preloader, Tabs, Tab, Pagination} from 'react-materialize';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../stylesheets/CreateSurvey.css';
import Chart from '../components/Chart';
import { fetchSurvey } from '../actions/index';

class ViewResult extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      questions: [],
      page: 1,
    };
  }

  componentWillMount(){
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
          let answers = responses.answers;
          answers.forEach((answer) => {
            let r = _.find(temp, {responseCount: answer.responseCount, question_id: answer.question_id});
            if(!r)
              temp.push(answer);
            else{
              r.response += ', ' + answer.response
            }
          });
          let data = _.groupBy(temp, function(a){return a.responseCount});
          this.setState({isLoading: false, data, questions: responses.questions });
        })
      }
    })
  }

  getData(){
    const index = this.state.page;
    const responses = this.state.data[index];
    const questions = this.state.questions;
    const data = [];
    data.push(<h5 className='center'> Response # {index} </h5>);
    responses.forEach((response) => {
      let q = _.find(questions, {id: response.question_id})
      data.push(
        <div className='center' style={{padding: 10, marginLeft: '30%', width: '40%', backgroundColor: 'green'}}>
          <h4 className='center'> {q.label} </h4>
          <h5 className='center'> {response.response} </h5>
        </div>
      );
    });
    return data;
  }

  render() {
    const { survey } = this.props;
    const { data, questions, isLoading } = this.state;
    let  dataAnalysis = [];

    let sortedQuestions = _.sortBy(this.props.survey.questions, (questions) => {
         return questions.id;
     });

     sortedQuestions.forEach((q) => {
       dataAnalysis.push(
         <div style={{
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
          <Chart key={q.id} question={q}/>
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
                <Pagination onSelect={(val) => this.setState({page:val})} className='center' items={Object.keys(data).length} activePage={this.state.page} maxButtons={10} />
                {this.getData(1)}
              </Tab>
              <Tab title="Data Analysis">
              {dataAnalysis}
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
