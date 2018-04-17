import React from 'react';
import PropTypes from 'prop-types';
import {Input,  Col} from 'react-materialize';

class Options extends React.Component {
    render() {
        const input = this.props.input;
        const options = [];
        input.options.forEach((o) => {
          options.push(<option value={o}> {o} </option>);
        });

        return (
          <Col style={{'height': '100px', 'textAlign': 'center'}}>
            <h5 style={{'margin': '0%', 'marginTop': '1%', 'textAlign': 'center'}}> {input.label} </h5>
            <Input style={{'width':'500px', 'marginLeft': '500px','marginBottom': '10%'}} type='select'>
              {options}
            </Input>
          </Col>
        );
    }
}

Options.propTypes = {
    input: PropTypes.object.isRequired
};

export default Options;
