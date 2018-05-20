import React, {Component} from 'react'
import {Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const $ = window.$;

class AddDefaultQuestion extends Component{
  render() {
    return(
      <Row>
        <Input type='textarea' id='options' s={12} label={'Options to choose from (Separated each by pressing \'enter\')'}/>
      </Row>
    )
  }
}

AddDefaultQuestion.propTypes = {
    survey: PropTypes.object.isRequired,
    question: PropTypes.object
};

export default connect(
    state => ({ survey: state.survey })
)(AddDefaultQuestion);
