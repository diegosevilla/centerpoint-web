import React, {Component} from 'react'
import {Modal, Button, Icon, Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './../stylesheets/CreateSurvey.css';

import { createQuestion } from './../actions/index';

const $ = window.$;
const Materialize = window.Materialize;

class AddModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      type: ''
    };
  }

  componentDidMount(){
    this.setState({type:'Text'});
  }


  add(e) {
    e.preventDefault();
    let newQuestion = {
      type:$('#type').val(),
      label:$('#label').val(),
      required:$('#required').is(':checked'),
      id: this.props.surveyId
    }

    switch(newQuestion.type){
      case 'Text':
        newQuestion.defaultValue = $('#defaultValue').val();
        break;
      case 'Number':
        newQuestion.minVal = $('#minValue').val();
        newQuestion.maxVal = $('#maxValue').val();
        newQuestion.step = $('#step').val();
        break;
      case 'Likert-Scale':
        let scale = $('#scale').val();
        if(scale==5)
          $('#options').val('Strongly Disagree\nDisagree\nNeither agree nor disagree\nAgree\nStrongly Agree');
        else if(scale==7)
          $('#options').val('Very Strongly Disagree\nStrongly Disagree\nDisagree\nNeither agree nor disagree\nAgree\nStrongly Agree\nVery Strongly Agree');
        else
          $('#options').val('Extremely Disagree\nVery Strongly Disagree\nStrongly Disagree\nAgree\nNeither agree nor disagree\nAgree\nStrongly Agree\nVery Strongly Agree');
      default:
        let options =  $('#options').val().split('\n');
        if(options.length == 1){
          Materialize.toast('Cannot add '+ newQuestion.type + ' question with only one option to choose from.', 4000, 'red lighten-1');
          return
        }
        newQuestion.options = options.join('&options=');
        alert(newQuestion.options);
    }

    this.props.createQuestion(newQuestion)
    .then(() => {
      Materialize.toast('Successfully added question.', 4000, 'green lighten-1');
      $('#addModal').modal('close');
      $('#type').val('Text').change();
      $('#label').val('');
      $('#required').prop('checked', false);
      switch(newQuestion.type){
        case 'Text':
          $('#defaultValue').val('');
          break;
        case 'Number':
          $('#minValue').val(0);
          $('#maxValue').val('');
          $('#step').val(1);
          break;
        default:
          $('#options').val('');
      }
      Materialize.updateTextFields();
    })
    .catch((err) => {
      $('#addModal').modal('close');
      Materialize.toast(err, 4000, 'red lighten-1');
    });
  }

  render() {
    switch(this.state.type){
      case 'Text':
        $('#defaultValue').show();
        $('label[for=\'defaultValue\']').show();
        $('#minValue').hide();
        $('label[for=\'minValue\']').hide();
        $('#maxValue').hide();
        $('label[for=\'maxValue\']').hide();
        $('#maxValue').attr('required',false);
        $('#step').hide();
        $('label[for=\'step\']').hide();
        $('#options').hide();
        $('label[for=\'options\']').hide();
        $('#options').attr('required',false);
        $('#scale').hide();
        $('#options').attr('required',false);
        $('label[for=\'scale\']').hide();
        break;
      case 'Number':
        $('#minValue').show();
        $('label[for=\'minValue\']').show();
        $('#maxValue').show();
        $('label[for=\'maxValue\']').show();
        $('#maxValue').attr('required',true);
        $('#step').show();
        $('label[for=\'step\']').show();
        $('#defaultValue').hide();
        $('label[for=\'defaultValue\']').hide();
        $('#options').hide();
        $('label[for=\'options\']').hide();
        $('#options').attr('required',false);
        $('#scale').hide();
        $('#options').attr('required',false);
        $('label[for=\'scale\']').hide();
        break;
      case 'Likert-Scale':
        $('#scale').show();
        $('#options').attr('required',true);
        $('label[for=\'scale\']').show();
        $('#minValue').hide();
        $('label[for=\'minValue\']').hide();
        $('#maxValue').hide();
        $('label[for=\'maxValue\']').hide();
        $('#maxValue').attr('required',false);
        $('#step').hide();
        $('label[for=\'step\']').hide();
        $('#defaultValue').hide();
        $('label[for=\'defaultValue\']').hide();
        $('#options').hide();
        $('label[for=\'options\']').hide();
        $('#options').attr('required',false);
        break;
      default:
        $('#options').show();
        $('label[for=\'options\']').show();
        $('#options').attr('required',true);
        $('#minValue').hide();
        $('label[for=\'minValue\']').hide();
        $('#maxValue').hide();
        $('label[for=\'maxValue\']').hide();
        $('#maxValue').attr('required',false);
        $('#step').hide();
        $('label[for=\'step\']').hide();
        $('#defaultValue').hide();
        $('label[for=\'defaultValue\']').hide();
        $('#scale').hide();
        $('#options').attr('required',false);
        $('label[for=\'scale\']').hide();
        break;
    }

    return(
      <Modal id='addModal' s={4} header='Add Survey Question' trigger={<Button className="blue-grey darken-1"> <Icon> add_circle_outline</Icon> Add Question</Button>}>
        <form id='addForm' onSubmit={(e) => this.add(e)}>
          <Row>
              <Input required='true' s={12} id='label' name='label' label='Label' defaultValue=''/>
              <Input required='true' s={12} id='type' onChange={ (e) => { e.preventDefault(); this.setState({type: $('#type').val()})}} type='select' label='Question Type' defaultValue='Text'>
                <option value='Text'>Text</option>
                <option value='Number'>Number</option>
                <option value='Options'>Options</option>
                <option value='Checkbox'>Checkbox</option>
                <option value='Likert-Scale'>Likert Scale</option>
              </Input>
              <Input id='required' type='checkbox' value='true' label='Is this question required?'/>
              <Input hidden type='number' s={12} id='scale' labelClassName='hidden' label='Number of Points' defaultValue='5' min='5' max='9' step='2'/>
              <Input hidden type='textarea' id='options' s={12} labelClassName='hidden' label={'Options to choose from (Separated each by pressing \'enter\')'}/>
              <Input s={12} id='defaultValue' label='Default Value'/>
              <Input hidden type='number' s={12} id='minValue' labelClassName='hidden' label='Minimum Value' defaultValue='0'/>
              <Input hidden type='number' s={12} id='maxValue' labelClassName='hidden' label='Maximum Value'/>
              <Input hidden type='number' s={12} id='step' labelClassName='hidden' label='Step' defaultValue='1'/>
          </Row>
          <Row>
            <Input type='submit' className='btn blue-grey darken-1'/>
          </Row>
        </form>
      </Modal>
    )
  }
}

AddModal.propTypes = {
    survey: PropTypes.object.isRequired,
    surveyId: PropTypes.string.isRequired,
    createQuestion: PropTypes.func.isRequired,
};

export default connect(
    state => ({ survey: state.survey }),
    { createQuestion }
)(AddModal);
