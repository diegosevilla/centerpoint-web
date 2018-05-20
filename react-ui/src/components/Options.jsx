import React from 'react';
import PropTypes from 'prop-types';
import {Input,  Col, Row} from 'react-materialize';

class Options extends React.Component {
    render() {
        const {input, number} = this.props;
        const options = []
        input.options.forEach((o) => {
          options.push(
            <Row style={{'margin':'5px'}}>
              <Input name={input.id+''} type='radio' value={o} label={o}/>
            </Row>
          );
        });

        const height = input.options.length * 25;
        const colHeight = height+100;
        return (
          <Col style={{ 'height': colHeight + 'px'}}>
            <Row style={{ 'margin': '0%', 'marginTop': '1%', 'marginBottom':'10px'}}>
              <h5> {number + ') ' + input.label} </h5>
            </Row>
            <Row style={{'height': height+'px', 'marginTop': '0px'}}>
              {options}
            </Row>
          </Col>
        );
    }
}

Options.propTypes = {
    input: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired
};

export default Options;
