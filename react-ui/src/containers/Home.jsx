import React, {Component} from 'react'
import {PropTypes}  from 'prop-types';
import {Button, Modal, Input, Icon, Row} from 'react-materialize';
import { connect } from 'react-redux';
import { createSurvey } from './../actions/index';
import styles from './../stylesheets/Home.css';
const Materialize = window.Materialize;
const $ = window.$;

class Home extends Component{
    createSurveyEvent (e){
        e.preventDefault();
        let surveyName = $('#surveyName').val();
        this.props.createSurvey(surveyName).then((res) => {
          window.location = '/create-survey/' + this.props.survey.id;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          Materialize.toast(JSON.stringify(err), 5000, 'toast-error');
        })
    }

    render() {
      return(
        <div>
          <div className='bg'>
            <div className='overlay'>
              <div className='empty'></div>
              <div className='section1 no-pad-bot' id='index-banner'>
                <div className='container'>
                  <h1 className='headerTitle center orange-text'>Cross Platform Survey Application</h1>
                  <div className='row center'>
                    <h5 className='headerCreate col s12 light'>Web Application for Creating and Designing Surveys</h5>
                  </div>
                  <div className='row center'>
                    <Modal header='Create New Survey' trigger={<Button className='createSurvey btn-large waves-effect waves-light blue-grey darken-1'>Create Survey</Button>}>
                      <form onSubmit={(e) => this.createSurveyEvent(e) }>
                        <Input id='surveyName' required='true' label='Survey Title'/>
                        <Input className='btn blue-grey darken-1' type='submit'/>
                      </form>
                    </Modal>
                    <a href='/view-result' className='viewResults btn-large waves-effect waves-light blue-grey darken-1'>View Results</a>
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
