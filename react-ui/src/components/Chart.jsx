import React from 'react';
import PropTypes from 'prop-types';
import {Input, Col} from 'react-materialize';
import { ResponsivePie, ResponsiveBar } from 'nivo';

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
        data.push({id: key, value: key, value: temp[key]});
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
          <ResponsivePie data={data}
            height={450}
            innerRadius={0.5}
            margin={{
              "top": 40,
              "right": 111,
              "bottom": 80,
              "left": 80
            }}
            padAngle={3}
            cornerRadius={0}
            colors='d320c'
            colorBy='id'
            borderWidth={4}
            borderColor='inherit:darker(0.6)'
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor='#333333'
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor='inherit'
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor='white'
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        );
        break;
      default:
        chart.push(
          <ResponsiveBar data={data} keys={['value']}
          margin={{
            "top": 50,
            "right": 130,
            "bottom": 50,
            "left": 60
          }}
          padding={0.45}
          colorBy="id"
          borderColor="inherit:darker(1.6)"
          borderWidth={2}
          axisBottom={{
              "orient": "bottom",
              "tickSize": 5,
              "tickPadding": 5,
              "tickRotation": 0,
              "legend": "OPTIONS",
              "legendPosition": "center",
              "legendOffset": 36
          }}
          axisLeft={{
              "orient": "left",
              "tickSize": 5,
              "tickPadding": 5,
              "tickRotation": 0,
              "legend": "FREQUENCY",
              "legendPosition": "center",
              "legendOffset": -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="inherit:darker(1.6)"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          legends={[
              {
                  "dataFrom": "keys",
                  "anchor": "bottom-right",
                  "direction": "column",
                  "translateX": 120,
                  "itemWidth": 100,
                  "itemHeight": 20,
                  "itemsSpacing": 2,
                  "symbolSize": 20
              }
          ]}/>
        );
    }

    return(
      <div style={{backgroundColor: 'white', height: 450, padding: 10}}>
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
