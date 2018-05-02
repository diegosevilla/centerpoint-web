import React, {Component} from 'react';
import {PropTypes}  from 'prop-types';
import {Button, Icon, Row, Input, Modal, Col, Preloader} from 'react-materialize';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../stylesheets/CreateSurvey.css';
import Chart from '../components/Chart';
import { fetchSurvey } from '../actions/index';

class ViewResult extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
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
        this.setState({isLoading: false});
      }

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
            backgroundColor: '#fcc2a1',
            textAlign: 'center'
         }} >
          <Chart question={q}/>
         </div>
       )
     })

    if(this.state.isLoading)
      return(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
            <Preloader size='big'/>
            <h1> Fetching Survey </h1>
        </Row>
      )
    else
    return(
      <div className='bgCS'>
        <div>
          <div className="resultHeader center ">
              <div className="home center">
                <Button floating large className='teal darken-2' waves='light' icon='home' onClick={(e) => {e.preventDefault() ; window.location = '/'}}/>
              </div>
              <br/>
              <div className="resultTitle center">
                <h3> {survey.surveyName} </h3>
                <h5> {'By: ' + survey.author} </h5>
                <h5> {survey.details} </h5>
              </div>
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
