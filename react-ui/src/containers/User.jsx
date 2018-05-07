import React, {Component} from 'react'
import {PropTypes}  from 'prop-types';
import {Button, Modal, Input, Icon, Row, Preloader, Table, Navbar, NavItem} from 'react-materialize';
import { connect } from 'react-redux';
import { createSurvey } from './../actions/index';
import styles from './../stylesheets/Home.css';
import _ from 'lodash';
import GoogleLogin from 'react-google-login';

import { login, check, logOut } from './../actions/index';

const Materialize = window.Materialize;
const $ = window.$;

class User extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {},
      surveys: [],
      surveyName: '',
      surveyId: '',
    };
  }

  componentWillMount(){
    this.props.check().then((user)=>{
      if(user.code == 200){
        fetch('/api/survey/author/'+user.user.email)
        .then((res) => res.json())
        .then((surveys) => {
          this.setState({isLoading:false, user:user.user, surveys: surveys});
        })
      }
      else {
        window.location = '/';
      }
    });
  }

  logoutFxn = () =>  {
    this.props.logOut().then((res) => {
      if(res.code == 200)
        window.location = '/'
    });

  }

  createSurveyEvent (e){
    e.preventDefault();
    let newSurvey = {
      surveyName: $('#surveyName').val(),
      author: this.state.user.email,
      details: $('#surveyDetails').val()
    }
    this.props.createSurvey(newSurvey).then((res) => {
      if(this.props.survey.id)
        window.location = '/design-survey/' + this.props.survey.id;
      else
        throw ({message:'Error creating survey'});
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      Materialize.toast(err.message, 5000, 'red lighten-1');
    })
  }

  render() {

    if(this.state.isLoading)
      return(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
            <Preloader size='big'/>
            <h1> Loading User </h1>
        </Row>
      )

    const {user, surveys, surveyName, surveyId} = this.state;

    const filteredSurveys = _.filter(surveys, function(s) { return ( s.surveyName.includes(surveyName) && s.surveyId.includes(surveyId)) });
    let temp = [];
    if(filteredSurveys.length == 0)
      temp.push(<h5> No Surveys Yet </h5>);
    _.forEach(filteredSurveys, function(survey){
      temp.push(
        <tr>
          <td> {survey.surveyName} </td>
          <td> {survey.surveyId} </td>
          <td>
            <Button small className='green' onClick={()=> window.location='/design-survey/'+survey.id} waves='light'> Edit Survey </Button>
            <Button small className='blue' onClick={()=> window.location='/view-result/'+survey.id} waves='light'> View Result </Button>
          </td>
        </tr>
      )
    });

    return(
      <div>
        <Navbar style={{backgroundColor: '#b27b05'}} brand='CenterPoint' right>
          <NavItem onClick={this.logoutFxn}>  Logout </NavItem>
        </Navbar>
        <div>
          <Row style={{backgroundColor: 'white', paddingTop: 50, width:'80%'}}>
            <Table>
              <thead>
                <tr>
                  <th data-field="title">
                    <Input onChange={(e)=>{this.setState({surveyName: $('#filterName').val()})}} id='filterName'  label='Survey Title'/>
                  </th>
                  <th data-field="id">
                    <Input onChange={(e)=>{this.setState({surveyId: $('#filterId').val()})}} id='filterId' label='SurveyId'/>
                  </th>
                  <th data-field="id">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody>
                {temp}
              </tbody>
            </Table>
            <Modal header='Create New Survey' trigger={<Button className='createSurvey btn-large waves-effect waves-light blue-grey darken-1'>Create New Survey</Button>}>
              <form onSubmit={(e) => this.createSurveyEvent(e) }>
                <Input id='surveyName' required='true' label='Survey Title'/>
                <Input type='textarea' id='surveyDetails' label='Details (short description of the survey)'/>
                <Input className='btn blue-grey darken-1' type='submit'/>
              </form>
            </Modal>
          </Row>
        </div>
      </div>
    )
  }
}

User.propTypes = {
  survey: PropTypes.object.isRequired,
  createSurvey: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  check: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired
};

export default connect(
  state => ({ survey: state.survey }),
  { createSurvey, login, check, logOut}
)(User)
