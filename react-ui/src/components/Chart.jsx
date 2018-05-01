import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';
import {PieChart, BarChart} from 'react-easy-chart';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryPie, VictoryTheme, VictoryLabel } from 'victory';
import _ from 'lodash';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      answers: []
    };
  }

  componentWillMount(){
    const {question} = this.props;
    fetch('/api/answer/'+question.id)
    .then((res) => res.json())
    .then((answers) => {
      let data = [];
      let temp = _.countBy(answers, 'response');
      for(let key in temp){
        data.push({name: key, count: temp[key]});
      }

      this.setState({data:data, answers: answers});
    })
  };

  render(){
    const {question} = this.props;
    let data = this.state.data;
    const chart = [];

    data = _.sortBy(data,[function(d) { return d.name; }])
    switch (question.questionType) {
      case 'Options':
        chart.push(
          <VictoryPie theme={VictoryTheme.material} padAngle={1} labelRadius={20} labels={(d) => d.name + '\n( ' + d.count + ' )'} height={220} data={data} x="name" y="count"/>
        );
        break;
      default:
        chart.push(
          <VictoryChart theme={VictoryTheme.material} domainPadding={30} height={220}>
            <VictoryBar style={{ data: { fill: "#c43a31" } }} barRatio={0.8} data={data} x='name' y='count'/>
          </VictoryChart>
        );
    }

    return(
      <div style={{backgroundColor: 'white', height: 450}}>
        {chart}
        <h4> {question.label} </h4>
      </div>
    )
  }
}

Chart.propTypes = {
    question: PropTypes.object.isRequired,
};

export default Chart;
