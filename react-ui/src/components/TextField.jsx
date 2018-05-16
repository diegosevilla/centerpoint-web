import React from 'react';
import PropTypes from 'prop-types';

import {Input, Col} from 'react-materialize';

class TextField extends React.Component {
    render() {
        const {input, number} = this.props;
        return (
          <Col style={{'height': '100px'}}>
            <h5 style={{'margin': '0%', 'marginTop': '1%'}}> {number + ') ' + input.label} </h5>
            <Input style={{'width': '500px', 'marginBottom': '10%',}} id={input.id+''} value={input.defaultValue} required={input.required}/>
          </Col>
        );
    }
}

TextField.propTypes = {
    input: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired
};

export default TextField;
