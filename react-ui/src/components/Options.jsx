import React from 'react';
import PropTypes from 'prop-types';
import {Input,  Col} from 'react-materialize';

class Options extends React.Component {
    render() {
        const {input, number} = this.props;
        const options = []
        input.options.forEach((o) => {
          options.push(<option value={o}> {o} </option>);
        });

        return (
          <Col style={{'height': '100px'}}>
            <h5 style={{'margin': '0%', 'marginTop': '1%'}}> {number + ') ' + input.label} </h5>
            <Input style={{'width':'500px', 'marginLeft': '500px','marginBottom': '10%'}} type='select'>
              {options}
            </Input>
          </Col>
        );
    }
}

Options.propTypes = {
    input: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired
};

export default Options;
