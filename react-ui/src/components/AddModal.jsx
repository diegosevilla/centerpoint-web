import React, {Component} from 'react'
import {Modal, Button, Icon, Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './../stylesheets/CreateSurvey.css';
import _ from 'lodash';

import { createQuestion } from './../actions/index';

import AddLikertQuestion from './AddLikertQuestion';
import AddDemographicQuestion from './AddDemographicQuestion';
import AddTextQuestion from './AddTextQuestion';
import AddNumberQuestion from './AddNumberQuestion';
import AddDefaultQuestion from './AddDefaultQuestion';

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
    this.setState({type:'Demographic'});
  }

  componentDidUpdate(){
    $('#label').val('');
    $('#label').change();
    if(this.state.type == 'Demographic'){
      $('#required').prop('checked', true);
    }
  }

  add(e) {
    e.preventDefault();
    let newQuestion = {
      type:$('#type').val(),
      label:$('#label').val(),
      required:$('#required').is(':checked'),
      id: this.props.survey.id
    }
    const survey = this.props.survey;
    switch(newQuestion.type){
      case 'Text':
        newQuestion.defaultValue = $('#defaultValue').val();
        break;
      case 'Number':
        newQuestion.minVal = $('#minValue').val();
        newQuestion.maxVal = $('#maxValue').val();
        newQuestion.step = $('#step').val();
        break;
      case 'Demographic':
        newQuestion.defaultValue = $('#demographic').val();
        if(newQuestion.defaultValue == 'Age'){
          newQuestion.minVal = $('#minAge').val();
          newQuestion.maxVal = $('#maxAge').val();
          newQuestion.step = $('#interval').val();
        }
        let options =  $('#options').val().split('\n');

        if(options == 'Error setting options'){
          Materialize.toast('Error adding '+ newQuestion.type + ' - ' + newQuestion.defaultValue + '.', 4000, 'red lighten-1');
          return
        }
        if(options.length <= 1){
          Materialize.toast('Cannot add '+ newQuestion.type + ' - ' + newQuestion.defaultValue + ' question with ' + options.length + ' option to choose from.', 4000, 'red lighten-1');
          return
        }
        newQuestion.options = options.join('&options=');
        break;
      case 'Likert-Scale':
        let su = $('#supports').val();
        su =  _.compact(su.split(','));
        let cn = $('#contradicts').val();
        cn = _.compact(cn.split(','))
        newQuestion.defaultValue = su + ':' + cn + ':' + $('#likertType').val();
      default:
        options =  $('#options').val().split('\n');
        if(options.length == 1){
          Materialize.toast('Cannot add '+ newQuestion.type + ' question with only one option to choose from.', 4000, 'red lighten-1');
          return
        }
        newQuestion.options = options.join('&options=');
        break;
    }
    this.props.createQuestion(newQuestion)
    .then(() => {
      Materialize.toast('Successfully added question.', 4000, 'green lighten-1');
      $('#addModal').modal('close');
      $('#type').val('Text').change();
      $('#label').val('');
      $('#required').prop('checked', false);
      Materialize.updateTextFields();
    })
    .catch((err) => {
      $('#addModal').modal('close');
      Materialize.toast(err, 4000, 'red lighten-1');
    });
  }

  render() {
    const form = [];
    switch(this.state.type){
      case 'Text':
        form.push(<AddTextQuestion survey={this.props.survey}/>);
        break;
      case 'Number':
        form.push(<AddNumberQuestion survey={this.props.survey}/>);
        break;
      case 'Demographic':
        form.push(<AddDemographicQuestion survey={this.props.survey}/>);
        break;
      case 'Likert-Scale':
        form.push(<AddLikertQuestion survey={this.props.survey}/>);
        break;
      default:
        form.push(<AddDefaultQuestion survey={this.props.survey}/>);
    }

    return(
      <Modal id='addModal' s={4} header='Add Survey Question' trigger={<Button className="blue-grey darken-1"> <Icon> add_circle_outline</Icon> Add Question</Button>}>
        <form id='addForm' onSubmit={(e) => this.add(e)}>
          <Row>
              <Input required='true' s={12} id='label' name='label' label='Label' defaultValue=''/>
              <Input required='true' s={12} id='type' onChange={ (e) => { e.preventDefault(); this.setState({type: $('#type').val()})}} type='select' label='Question Type' defaultValue='Demographic'>
                <option value='Demographic'>Demographic</option>
                <option value='Text'>Text</option>
                <option value='Number'>Number</option>
                <option value='Options'>Options</option>
                <option value='Checkbox'>Checkbox</option>
                <option value='Likert-Scale'>Likert Scale</option>
              </Input>
              <Input id='required' type='checkbox' label='Is this question required?'/>
          </Row>
          {form}
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
    createQuestion: PropTypes.func.isRequired,
};

export default connect(
    state => ({ survey: state.survey }),
    { createQuestion }
)(AddModal);
