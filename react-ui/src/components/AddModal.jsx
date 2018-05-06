import React, {Component} from 'react'
import {Modal, Button, Icon, Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createQuestion } from './../actions/index';

const $ = window.$;
const Materialize = window.Materialize;
class AddModal extends Component{
    state = {
      type: ''
    }

    componentWillMount(){
      this.setState({type: 'Text'});
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
        default:
          let options =  $('#options').val();
          newQuestion.options = options.replace(new RegExp('\n','g') , '&options=');
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
                </Input>
                <Input id='required' type='checkbox' value='true' label='Required'/>
                <Input type='textarea' required='true' id='options' s={12} label='Options (Separated  by new line)'/>
                <Input s={12} id='defaultValue' label='Default Value'/>
                <Input type='number' required='true' s={12} id='minValue' label='Minimum Value' defaultValue='0'/>
                <Input type='number' required='true' s={12} id='maxValue' label='Maximum Value'/>
                <Input type='number' required='true' s={12} id='step' label='Step' defaultValue='1'/>

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
