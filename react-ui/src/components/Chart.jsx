import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';
import {PieChart, BarChart} from 'react-easy-chart';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryPie } from 'victory';
import _ from 'lodash';

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
    const labels = [];

    answers.forEach((answer) => {
      labels.push(answer.name);
      answer.value = parseInt(answer.count);
    });

    switch (question.questionType) {
      case 'Options':
        chart.push(
          <VictoryPie colorScale={["tomato", "orange", "gold", "cyan", "navy" ]} height={250} data={answers} x="name" y="count"/>
        );
        break;
      default:
        chart.push(
          <VictoryChart height={250} domainPadding={60}>
            <VictoryAxis tickFormat={ answers.map((a) => a.name)}/>
            <VictoryAxis dependentAxis tickFormat={[1,2,3,4]}/>
            <VictoryBar data={answers} x="name" y="count"/>
          </VictoryChart>
        );
    }

    return(
      <div style={{backgroundColor: 'white'}}>
        <h5> {question.label} </h5>
        {chart}
      </div>
    )
  }
}

Chart.propTypes = {
    question: PropTypes.object.isRequired,
};

export default Chart;
