import React, {Component} from 'react';
import {PropTypes}  from 'prop-types';
import {Button, Icon, Row, Input, Modal, Col, Preloader} from 'react-materialize';
import { connect } from 'react-redux';
import _ from 'lodash';

import TextField from '../components/TextField';
import NumberField from '../components/NumberField';
import Options from '../components/Options';
import CheckBox from '../components/CheckBox';

import EditModal  from '../components/EditModal';
import AddModal from '../components/AddModal'
import { fetchSurvey, getSurvey, createQuestion, deleteQuestion, updateSurvey, check } from './../actions/index';

import styles from './../stylesheets/CreateSurvey.css';

const $ = window.$;
const Materialize = window.Materialize
class CreateSurvey extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {}
    };
  }

  componentWillMount(){
    let id = window.location.pathname.replace(/\/design-survey\//, '');
    this.props.fetchSurvey(id)
    .then(()=>{
      if(this.props.survey.id === -1){
        alert("Error creating survey!");
        window.location = '/';
      } else {
        this.props.check().then((res)=>{
          if(res.code === 200){
              this.setState({isLoading: false, user:res.user})
          }
          else {
            window.location = '/';
          }
        });
      }
    });
  }

  remove(e, input){
    if(!window.confirm('Are you sure you want to remove this question?')) return;
    this.props.deleteQuestion(input.id)
    .then(()=>{Materialize.toast('Successfully removed question', 2000, 'green lighten-1')})
    .catch(()=>{Materialize.toast('Error removing question', 2000, 'red lighten-1')});
  }

  cancel(e){
    if(!window.confirm('Are you sure you want to delete this survey?')) return;
    let id = this.props.survey.id;
    fetch('/api/survey/cancel/'+id, {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }).then((res) => {
      if(res.status === 200)
        window.location = '/user';
      else
        Materialize.toast('Error deleting survey', 2000, 'red lighten-1')
    })
  }


  editSurvey(e){
    e.preventDefault();
    let survey = {
      id: this.props.survey.id,
      surveyName: $('#surveyName').val(),
      details: $('#details').val(),
      author: this.state.user.email,
    };
    this.props.updateSurvey(survey);
    $('#editSurvey').modal('close');
  }

  render() {
    const { survey } = this.props;
    let  inputs = [];

    let i = 1;
    survey.questions.forEach((input) => {
      let newQuestion = null;
      switch(input.questionType){
        case 'Text': newQuestion = <TextField key={input.id} input={input} number={i}/>; break;
        case 'Number': newQuestion = <NumberField key={input.id} input={input} number={i}/>; break;
        case 'Checkbox': newQuestion = <CheckBox key={input.id} input={input} number={i}/>;break;
        default:
          if(input.defaultValue != 'Age')
            newQuestion = <Options key={input.id} input={input} number={i}/>;
          else
            newQuestion = <NumberField key={input.id} input={input} number={i} step={1}/>;
      }
      inputs.push(
        <Row key={input.id} style={{'marginTop': '1%', 'width': '50%'}}>
          <Col style={{'backgroundColor': '#ededff', 'borderRadius': '5px','paddingTop': '5px', 'marginTop': '0%', 'width':'73%'}}>
            {newQuestion}
          </Col>
          <Col style={{'marginTop': '1%', 'width':'10%'}}>
            <EditModal key={input.id+'-edit'} input={input}/>
            <Button key={input.id+'remove'} s={12} floating small='true' onClick={(e) => this.remove(e, input)} className='red delete' waves='light' tooltip='Delete'> <Icon> delete </Icon> </Button>
          </Col>
        </Row>
      );
      i++;
    });

    if(this.state.isLoading)
      return(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
            <Preloader size='big'/>
            <h1> Loading Survey </h1>
        </Row>
      )
    else
    return(
      <div className='bgCS'>
        <div>
          <div className="essentials center">
            <div className="home center">
              <Button floating large className='teal darken-2' waves='light' icon='home' onClick={(e) => {e.preventDefault() ; window.location = '/user'}}/>
            </div>
            <div className="survId center">
              <h5><b>SURVEY ID:</b> {survey.surveyId} </h5>
            </div>
            <br/><br/>
            <Row>
              <div className="survTitle center">
                <h4> {survey.surveyName} </h4>
                <h6> By: {survey.author} </h6>
                <h6> {survey.details} </h6>
              </div>
              <Modal id='editSurvey' header='Edit Survey Details' trigger={<Button className="btnEditTitle blue-grey dark-1"><Icon> edit </Icon> Edit Survey Details </Button>}>
                <form onSubmit={(e) => this.editSurvey(e) }>
                  <Input id='surveyName' required='true' defaultValue={survey.surveyName} label='Survey Title'/>
                  <Input type='textarea' id='details' defaultValue={survey.details} label='Details (short description of the survey)'/>
                  <Input className='btn blue-grey darken-1' type='submit'/>
                </form>
              </Modal>
              <AddModal/>
              <Button className="btnCancel red dark-1" onClick={(e) => this.cancel(e)}> <Icon> cancel </Icon> Delete Survey </Button>
            </Row>
          </div>
         <Row className="questionRow">
            {inputs}
         </Row>
        </div>
      </div>
    )
  }
}

CreateSurvey.propTypes = {
    survey: PropTypes.object.isRequired,
    getSurvey: PropTypes.object.isRequired,
    fetchSurvey: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    updateSurvey: PropTypes.func.isRequired,
    check: PropTypes.func.isRequired
};
export default connect(
    state => ({ survey: state.survey }),
    {getSurvey, fetchSurvey, createQuestion, deleteQuestion, updateSurvey, check }
)(CreateSurvey);
