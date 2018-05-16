import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';

class CheckBox extends React.Component {
    render() {
        const {input, number} = this.props;
        const checkBox = [];

        input.options.forEach((o) => {
          checkBox.push(<Input key={input.id+'-'+o} name={input.id+''} style={{'backgroundColor': 'red'}} type='checkbox' value={o} label={o}/>);
        });

        return (
          <Col style={{'height': '100px'}}>
            <h5 style={{'margin': '0%', 'marginTop': '1%', 'marginBottom': '1%'}}> {number + ') ' + input.label} </h5>
            <div style={{'backgroundColor': 'red'}}>
              {checkBox}
            </div>
          </Col>
        );
    }
}

CheckBox.propTypes = {
    input: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired
};

export default CheckBox;
