import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';

class NumberField extends React.Component {
    render() {
        const {input, number, step} = this.props;
        let interval = step? step : input.step;
        
        return (
          <Col style={{'height': '100px'}}>
            <h5 style={{'margin': '0%', 'marginTop': '1%'}}> {number +') ' + input.label} </h5>
            <Input style={{'width':'500px', 'marginBottom': '10%'}} type="number" min={input.minVal} max={input.maxVal} step={interval} id={input.id} required={input.required} defaultValue={input.minValue}/>
          </Col>
        );
    }
}

NumberField.propTypes = {
    input: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired
};

export default NumberField;
