import React, {Component} from 'react'
import {Input, Row, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

const $ = window.$;
const Materialize = window.Materialize;

export class AgeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 1,
      max: 2,
      interval:1
    };
  }

  componentDidMount(){
    const {question} = this.props;
    if(question){
      this.setState({min:question.minVal, max: question.maxVal, interval: question.step});
    }
  }

  render() {
    const {question} = this.props;
    const {min, max, interval} = this.state;
    const id = question? '-'+question.id : '';
    let i;

    $('#label'+id).val('What is your age?');
    $('#label'+id).change();

    let value='Below ' + min + '\n';
    for( i = parseInt(min); i < parseInt(max) ; ){
      let nextStep = (i+parseInt(interval)-1);
      if(nextStep > max)
        nextStep = max;

      value += i==nextStep? i + '\n' : i+' - '+ nextStep +'\n';
      i = parseInt(nextStep)+1;
    }
    value += 'Above ' + (parseInt(i)-1);

    if(!min || !max || !interval || min > max)
      value='Error setting options';

    return (
      <Row>
        <Row>
          <Input id={'minAge'+id} type='number' onChange={ (e) => { this.setState({min: $('#minAge'+id).val()}) } } label='Minimum Age' value={min} min={0}/>
          <Input id={'maxAge'+id} type='number' onChange={ (e) => { this.setState({max: $('#maxAge'+id).val()}) } } label='Maximum Age' value={max} min={parseInt(min)+parseInt(interval)}/>
          <Input id={'interval'+id} type='number' onChange={ (e) => { this.setState({interval: $('#interval'+id).val()}) } } label='Interval' value={interval} min={1}/>
        </Row>
        <Row>
          <h5> Options </h5>
          <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
            {value.split('\n').map((v) => {
              return (<p> {v} </p>)
            })}
          </Row>
          <Input type='textarea' hidden id={'options'+id} value={value}/>
        </Row>
      </Row>
    )
  }
}

AgeForm.propTypes = {
  question: PropTypes.object
};

export class GenderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ['Male', 'Female']
    };
  }

  componentDidMount(){
    const {question} = this.props;
    if(question){
      this.setState({value: question.options});
    }
  }

  delete(e,v){
    e.preventDefault();
    const {value} = this.state;
    this.setState({value: _.without(value, v)});
  }

  add(e, id){
    const {value} = this.state;

    let newVal = $('#gender'+id).val();
    if(newVal == ''){
      Materialize.toast('Please Enter value', 'red-lighten 1', '4000');
      return;
    }
    $('#gender'+id).val('');
    this.setState({value: _.concat(value, [newVal])});
  }

  render() {
    const {question} = this.props;
    const {value} = this.state;
    const id = question? '-'+question.id : '';

    $('#label'+id).val('To which gender identity do you most identify?');
    $('#label'+id).change();

    return (
      <Row>
        <h5> Options </h5>
        <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
          {value.map((v) => {
            return (
              <Row>
                {v}
                <Button className='btn-mini' type='button' onClick={(e) => this.delete(e, v)}floating small className='red' waves='light' icon='delete' />
              </Row>
            )
          })}
        </Row>
        <Row>
          <Input s={8} id={'gender'+id} label={'Add new gender identity'}/>
          <Button type='button' onClick={(e)=>this.add(e,id)} floating small className='green' waves='light' icon='add'/>
          <Input type='textarea' hidden id={'options'+id} value={value.join('\n')}/>
        </Row>
      </Row>
    )
  }
}

GenderForm.propTypes = {
  question: PropTypes.object
};

export class MaritalForm extends React.Component {
  render() {
    const {question} = this.props;
    const id = question? '-'+question.id : '';
    const value='Single (never married)\nMarried, or in a domestic partnership\nWidowed\nDivorced\nSeparated';

    $('#label'+id).val('What is your marital status?');
    $('#label'+id).change();

    return (
      <Row>
        <h5> Options </h5>
        <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
          {value.split('\n').map((v) => {
            return (<p> {v} </p>)
          })}
        </Row >
        <Input type='textarea' hidden id={'options'+id} value={value}/>
      </Row>
    )
  }
}

MaritalForm.propTypes = {
  question: PropTypes.object
};

export class EducationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {question} = this.props;
    const id = question? '-'+question.id : '';
    const value='Less than a high school diploma\nHigh school degree or equivalent (e.g. GED)\nSome college, no degree\nAssociate degree (e.g. AA, AS)\nBachelor’s degree (e.g. BA, BS)\nMaster’s degree (e.g. MA, MS, MEd)\nProfessional degree (e.g. MD, DDS, DVM)\nDoctorate (e.g. PhD, EdD)';

    $('#label'+id).val('What is the highest degree or level of school you have completed?');
    $('#label'+id).change();

    return (
      <Row>
        <h5> Options </h5>
        <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
          {value.split('\n').map((v) => {
            return (<p> {v} </p>)
          })}
        </Row>
        <Input type='textarea' hidden id={'options'+id} value={value}/>
      </Row>
    )
  }
}

EducationForm.propTypes = {
  question: PropTypes.object
};

export class EmploymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'FullTime'
    };
  }

  render() {
    const {question} = this.props;
    const id = question? '-'+question.id : '';
    const value='Employed full time (40 or more hours per week)\nEmployed part time (up to 39 hours per week)\nUnemployed and currently looking for work\nUnemployed and not currently looking for work\nStudent\nRetired\nHomemaker\nSelf-employed\nUnable to work';

    $('#label'+id).val('What is your current employment status?');
    $('#label'+id).change();

    return (
      <Row>
        <h5> Options </h5>
        <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
          {value.split('\n').map((v) => {
            return (<p> {v} </p>)
          })}
        </Row>
        <Input type='textarea' hidden id={'options'+id} value={value}/>
      </Row>
    )
  }
}

EmploymentForm.propTypes = {
  question: PropTypes.object
};

export class IncomeForm extends React.Component {
  render() {
    const {question} = this.props;
    const id = question? '-'+question.id : '';
    const value='Less than Php 20,000\nPhp 20,000 to Php 34,999\nPhp 35,000 to Php 49,999\nPhp 50,000 to Php 74,999\nPhp 75,000 to Php 99,999\nOver Php 100,000';

    $('#label'+id).val('Monthly Income');
    $('#label'+id).change();

    return (
      <Row>
        <h5> Options </h5>
        <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
          {value.split('\n').map((v) => {
            return (<p> {v} </p>)
          })}
        </Row>
        <Input type='textarea' hidden id={'options'+id} value={value}/>
      </Row>
    )
  }
}

IncomeForm.propTypes = {
  question: PropTypes.object
};
