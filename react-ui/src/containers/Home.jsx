import React, {Component} from 'react'
import {PropTypes}  from 'prop-types';
import {Button, Modal, Input, Icon, Row, Preloader, Table} from 'react-materialize';
import { connect } from 'react-redux';
import { createSurvey } from './../actions/index';
import styles from './../stylesheets/Home.css';
import _ from 'lodash';
import GoogleLogin from 'react-google-login';

import { login, check, logOut } from './../actions/index';

const Materialize = window.Materialize;
const $ = window.$;

class Home extends Component{
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.props.check().then((user)=>{
      if(user.code == 200)
        window.location = '/user';
    });
  }

  logInFxn = (response) => {
    let data = response.profileObj;
    this.props.login(data).then((res) => {
      if(res.code == 200)
        window.location = '/user';
      else
        Materialize.toast(res.msg, 5000, 'red lighten-1');
    });
  }

  errorFxn = (response) => {
    console.log(JSON.stringify(response));
  }


  render() {
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
                  <Row>
                    <GoogleLogin
                     clientId="780648072300-os8d56m9bjovvcqu9krlf6hn0lvv4vhp.apps.googleusercontent.com"
                     buttonText="Login using Gmail"
                     onSuccess={this.logInFxn}
                     onFailure={this.errorFxn}
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
  login: PropTypes.func.isRequired,
  check: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired
};

export default connect(
  state => ({ survey: state.survey }),
  { createSurvey, login, check, logOut}
)(Home)
