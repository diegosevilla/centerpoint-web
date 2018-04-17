import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';

class CheckBox extends React.Component {
    render() {
        const input = this.props.input;
        const checkBox = [];

        input.options.forEach((o) => {
          checkBox.push(<Input key={input.id+'-'+o} name={input.id+''} style={{'backgroundColor': 'red'}} type='checkbox' value={o} label={o}/>);
        });

        return (
          <Col style={{'height': '100px', 'textAlign': 'center'}}>
            <h5 style={{'margin': '0%', 'marginTop': '1%', 'textAlign': 'center'}}> {input.label} </h5>
            <div style={{'backgroundColor': 'red'}}>
              {checkBox}
            </div>
          </Col>
        );
    }
}

CheckBox.propTypes = {
    input: PropTypes.object.isRequired
};

export default CheckBox;
