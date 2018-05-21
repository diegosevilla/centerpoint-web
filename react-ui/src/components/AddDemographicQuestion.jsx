import React, {Component} from 'react'
import {Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AgeForm, GenderForm, MaritalForm, EducationForm, EmploymentForm, IncomeForm } from './Demographic';
const $ = window.$;

class AddDemographicQuestion extends Component{
  constructor(props){
    super(props);
    this.state={
      type: 'Age'
    }
  }

  componentDidMount(){
    const {type} = this.state;
    const {question} = this.props;
    const id = question? '-'+question.id : '';
    this.setState({type: question? question.defaultValue : type});
  }

  render() {
    const {type} = this.state;
    const {question} = this.props;
    const id = question? '-'+question.id : '';

    const form = [];
    switch(type){
      case 'Age':
        form.push(<AgeForm question={question}/>);
        break;
      case 'Gender':
        form.push(<GenderForm question={question}/>);
        break;
      case 'Marital-Status':
        form.push(<MaritalForm question={question}/>);
        break;
      case 'Education-Information':
        form.push(<EducationForm question={question}/>);
        break;
      case 'Employment-Information':
        form.push(<EmploymentForm question={question}/>);
        break;
      default:
        form.push(<IncomeForm question={question}/>);
    }

    return(
      <Row>
        <Input id={'demographic'+id} s={12} onChange={ (e) => this.setState({type:$('#demographic'+id).val()})} type='select' label='Type of Demographic Data' value={type}>
          <option value='Age'>Age</option>
          <option value='Gender'>Gender</option>
          <option value='Marital-Status'>Marital Status</option>
          <option value='Education-Information'>Education Information</option>
          <option value='Employment-Information'>Employment Information</option>
          <option value='Household-Income'>Household Income</option>
        </Input>
        {form}
      </Row>
    )
  }
}

AddDemographicQuestion.propTypes = {
    survey: PropTypes.object.isRequired,
    question: PropTypes.object
};

export default connect(
    state => ({ survey: state.survey })
)(AddDemographicQuestion);
