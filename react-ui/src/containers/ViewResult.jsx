import React, {Component} from 'react';
import {PropTypes}  from 'prop-types';
import {Button, Icon, Row, Input, Modal, Col} from 'react-materialize';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../stylesheets/CreateSurvey.css';
import Chart from '../components/Chart';
import { fetchSurvey } from '../actions/index';

class ViewResult extends Component{
  componentWillMount(){
    let id = window.location.pathname.replace(/\/view-result\//, '');
    this.props.fetchSurvey(id)
    .then(()=>{
      if(this.props.survey.id === -1){
        window.location = '/';
      };
    })
  }

  render() {
    const { survey } = this.props;
    let  inputs = [];

    let sortedQuestions = _.sortBy(this.props.survey.questions, (questions) => {
         return questions.id;
     });

     sortedQuestions.forEach((q) => {
       inputs.push(
         <div key={q.id} style={{
            padding: '10px',
            width: '50%',
            marginLeft: '25%',
            marginRight: '25%',
            marginTop: '2%',
            marginBottom: '2%',
            height: '550px',
            backgroundColor: 'red',
            textAlign: 'center'
         }} >
          <Chart question={q}/>
         </div>
       )
     })

    return(
      <div className='bgCS'>
        <div>
          <div className="resultHeader center ">
            <Row>
              <div className="survTitle center">
                <h3> {survey.surveyName} </h3>
                <h5> {'By: ' + survey.author} </h5>
                <h5> {survey.details} </h5>
              </div>
            </Row>
          </div>
         <Row className="resultBody">
            {inputs}
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
