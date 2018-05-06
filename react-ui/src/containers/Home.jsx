import React, {Component} from 'react'
import {PropTypes}  from 'prop-types';
import {Button, Modal, Input, Icon, Row, Preloader, Table} from 'react-materialize';
import { connect } from 'react-redux';
import { createSurvey } from './../actions/index';
import styles from './../stylesheets/Home.css';
import _ from 'lodash';
import GoogleLogin from 'react-google-login';

const Materialize = window.Materialize;
const $ = window.$;

class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      surveys: [],
      surveyId: '',
      surveyName: '',
      author: '',
    };
  }

  componentDidMount(){
    fetch('/api/survey/')
    .then((res) => res.json())
    .then((surveys) => {
      this.setState({isLoading:false,  surveys: surveys});
    })
  }

  responseGoogle = (response) => {
    console.log(response);
  }

  createSurveyEvent (e){
      e.preventDefault();
      let newSurvey = {
        surveyName: $('#surveyName').val(),
        author: $('#author').val(),
        details: $('#surveyDetails').val()
      }
      this.props.createSurvey(newSurvey).then((res) => {
        if(this.props.survey.id)
          window.location = '/create-survey/' + this.props.survey.id;
        else
          throw ({message:'Error creating survey'});
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        Materialize.toast(err.message, 5000, 'red lighten-1');
      })
  }

  render() {
    const {surveyName, isLoading, author, surveyId, surveys} = this.state;
    let filteredSurveys = _.filter(surveys, function(s) { return ( s.surveyName.includes(surveyName) &&  s.author.includes(author) && s.surveyId.includes(surveyId)) });
    var viewData = [];

    if(isLoading){
      viewData.push(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
          <Preloader size='big'/>
          <h4> Fetching Surveys </h4>
        </Row>
      )
    } else {
      let temp = [];
      _.forEach(filteredSurveys, function(survey){
        temp.push(
          <tr onClick={()=> window.location='/view-result/'+survey.id}>
            <td> {survey.surveyName} </td>
            <td> {survey.author} </td>
            <td> {survey.surveyId} </td>
          </tr>
        )
      });
      viewData.push(
        <Row>
          <Table>
            <thead>
              Filter by:
              <tr>
                <th data-field="title">
                  <Input onChange={(e)=>{this.setState({surveyName: $('#filterName').val()})}} id='filterName'  label='Survey Title'/>
                </th>
                <th data-field="author">
                  <Input onChange={(e)=>{this.setState({author: $('#filterAuthor').val()})}} id='filterAuthor' label='Author'/>
                </th>
                <th data-field="id">
                  <Input onChange={(e)=>{this.setState({surveyId: $('#filterId').val()})}} id='filterId' label='SurveyId'/>
                </th>
              </tr>
            </thead>
            <tbody>
              {temp}
            </tbody>
          </Table>
        </Row>
      )
    }

    return(
      <div>
        <div className='bg'>
          <div className='overlay'>
            <div className='empty'></div>
            <div className='section1 no-pad-bot' id='index-banner'>
              <div className='container'>
                <h1 className='headerTitle center orange-text'> CenterPoint </h1>
                <h3 className='center orange-text'>A Multi-platform System for Developing, Conducting, Analyzing, and Publishing Surveys </h3>
                <div className='row center'>
                  <h5 className='headerCreate col s12 light'>Web Application for Creating and Designing Surveys</h5>
                </div>
                <div className='row center'>
                  <Modal header='Create New Survey' trigger={<Button className='createSurvey btn-large waves-effect waves-light blue-grey darken-1'>Create Survey</Button>}>
                    <form onSubmit={(e) => this.createSurveyEvent(e) }>
                      <Input id='surveyName' required='true' label='Survey Title'/>
                      <Input id='author' required='true' label='Author'/>
                      <Input type='textarea' id='surveyDetails' label='Details (short description of the survey)'/>
                      <Input className='btn blue-grey darken-1' type='submit'/>
                    </form>
                  </Modal>
                  <Modal header='Find Survey' trigger={<Button className='createSurvey btn-large waves-effect waves-light blue-grey darken-1'>View Result</Button>}>
                    {viewData}
                  </Modal>
                  <Row>
                  <GoogleLogin
                   clientId="504260256093-2t6sc1e95aetvpdvpd4t5sn96kkt09p4.apps.googleusercontent.com"
                   buttonText="Login"
                   onSuccess={this.responseGoogle}
                   onFailure={this.responseGoogle}
                  />
                  </Row>
                </div>
              </div>
              <div className='empty'></div>
              <Row className='row iconHolder'>
                <div className='col s12 m4 center'>
                    <Icon large className='icon'> desktop_windows </Icon>
                    <h5 className='center'>  Design </h5>
                    <p className='light'> Use the web application to design and edit your survey questionnaire. </p>
                </div>
                <div className='col s12 m4 center'>
                    <Icon large className='icon'> phone_android </Icon>
                    <h5 className='center'>  Gather </h5>
                    <p className='light'> Use the mobile app to gather data from respondents. </p>
                </div>
                <div className='col s12 m4 center'>
                    <Icon large className='icon'> insert_chart </Icon>
                    <h5 className='center'> Analyze </h5>
                    <p className='light'> The web application also produces a graphical representation of data gathered. </p>
                </div>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  survey: PropTypes.object.isRequired,
  createSurvey: PropTypes.func.isRequired,
};

export default connect(
  state => ({ survey: state.survey }),
  { createSurvey }
)(Home)
