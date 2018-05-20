import React, {Component} from 'react'
import {Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class AddTextQuestion extends Component{
  render() {
    return(
      <Row>
        <Input s={12} id='defaultValue' label='Default Value'/>
      </Row>
    )
  }
}

AddTextQuestion.propTypes = {
    survey: PropTypes.object.isRequired,
    question: PropTypes.object
};

export default connect(
    state => ({ survey: state.survey })
)(AddTextQuestion);
