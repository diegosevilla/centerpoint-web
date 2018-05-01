import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';
import {PieChart, BarChart} from 'react-easy-chart';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: []
    };
  }

  componentWillMount(){
    const {question} = this.props;
    fetch('/api/answer/count/'+question.id)
    .then((res) => res.json())
    .then((answers) => {
      this.setState({answers: answers});
    })
  }

  render(){
    const {question} = this.props;
    const {answers} = this.state;
    const chart = [];

    switch (question.questionType) {
      case 'Options':
        answers.forEach((answer) => {
          answer.key = answer.name;
          answer.value = parseInt(answer.count);
        });

        chart.push(<PieChart data={answers} labels/>)
        break;
      default:
        answers.forEach((answer) => {
          answer.x = answer.name;
          answer.y = answer.count;
        });
        chart.push(<BarChart grid axes colorBars height={400} width={350} data={answers} labels/>)
    }

    return(
      <div style={{backgroundColor: 'white'}}>
        <h3> {question.label} </h3>
        {chart}
      </div>
    )
  }
}

Chart.propTypes = {
    question: PropTypes.object.isRequired,
};

export default Chart;
