import React, {Component} from 'react'
import {Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const $ = window.$;
const Materialize = window.Materialize;

class AddNumberQuestion extends Component{
  render() {
    return(
      <Row>
        <Input type='number' s={12} id='minValue' label='Minimum Value' defaultValue='0'/>
        <Input type='number' s={12} id='maxValue' label='Maximum Value'/>
        <Input type='number' s={12} id='step' label='Step' defaultValue='1'/>
      </Row>
    )
  }
}

AddNumberQuestion.propTypes = {
    survey: PropTypes.object.isRequired,
    question: PropTypes.object
};

export default connect(
    state => ({ survey: state.survey })
)(AddNumberQuestion);
