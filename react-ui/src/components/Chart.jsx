import React from 'react';
import PropTypes from 'prop-types';
import { Collection, CollectionItem, Tabs, Tab} from 'react-materialize';
import { ResponsivePie, ResponsiveBar,ResponsiveLine } from 'nivo';
import _ from 'lodash';
import Math from 'mathjs'
import styles from '../stylesheets/CreateSurvey.css';

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
        data.push({id: key, key: key, value: temp[key]});
      }

      this.setState({data:data, answers: answers});
    })
  };

  render(){
    const {question} = this.props;
    let {answers, data} = this.state;
    const chart = [];

    if(data.length === 0)
      return(
        <div style={{backgroundColor: 'white', height: 500, padding: 10}}>
          <h5> No Results Yet </h5>
        </div>
      )
    data = _.sortBy(data,[function(d) { return d.name; }]);
    answers = _.sortBy(answers, [function(d) { return d.response}])
    switch (question.questionType) {
      case 'Text':
        chart.push(
          <Collection header={question.label}>
            <div className='innerbox'>
              {
                answers.map((answer)=>{
                  return <CollectionItem style={{borderStyle: 'line'}}> {answer.response} </CollectionItem>
                })
              }
            </div>
          </Collection>
        )
        break;
        case 'Checkbox':
          chart.push(
            <ResponsiveBar data={data} keys={['value']}
              margin={{
                "top": 50,
                "right": 130,
                "bottom": 50,
                "left": 60
              }}
              padding={0.45}
              colors='set3'
              colorBy='id'
              borderColor="inherit:darker(1.6)"
              borderWidth={2}
              axisBottom={{
                  "orient": "bottom",
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": question.label,
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
            />
          );
          break;
      case 'Number':
        let array = _.map(answers, function(a) {return a.response});
        let stat = [];
        if(array.length > 0){
          let tempMode = Math.mode(array);
          let mode = (Array.isArray(tempMode))? _.max(tempMode) : tempMode;
          stat.push({id:'Mean', x:'Mean', y:Math.mean(array)})
          stat.push({id:'Median', x:'Median', y:Math.median(array)})
          stat.push({id:'Mode', x:'Mode', y:mode})
          chart.push(
            <Tabs className='tab-demo z-depth-1'>
              <Tab title="Statistics">
                <div style={{backgroundColor: 'white', height: 350}}>
                  <h5> {question.label} </h5>
                    <ResponsiveLine
                      data={[{id:question.label, data:stat}]}
                      margin={{
                          "top": 50,
                          "right": 110,
                          "bottom": 50,
                          "left": 60
                      }}
                      minY="auto"
                      stacked={true}
                      curve="cardinal"
                      axisBottom={{
                          "orient": "bottom",
                          "tickSize": 5,
                          "tickPadding": 5,
                          "tickRotation": 0,
                          "legend": question.label,
                          "legendOffset": 36,
                          "legendPosition": "center"
                      }}
                      axisLeft={{
                          "orient": "left",
                          "tickSize": 5,
                          "tickPadding": 5,
                          "tickRotation": 0,
                          "legend": "count",
                          "legendOffset": -40,
                          "legendPosition": "center"
                      }}
                      dotSize={10}
                      dotColor="inherit:darker(0.3)"
                      dotBorderWidth={2}
                      dotBorderColor="#ffffff"
                      enableDotLabel={true}
                      dotLabel="y"
                      dotLabelYOffset={-12}
                      animate={true}
                      motionStiffness={90}
                      motionDamping={15}
                      legends={[
                          {
                              "anchor": "bottom-right",
                              "direction": "column",
                              "translateX": 100,
                              "itemWidth": 80,
                              "itemHeight": 20,
                              "symbolSize": 12,
                              "symbolShape": "circle"
                          }
                      ]}
                  />
                </div>
              </Tab>
              <Tab active title="Results">
                <div style={{backgroundColor: 'white', height: 350}}>
                  <h5> {question.label} </h5>
                  <ResponsivePie data={data}
                    height={350}
                    margin={{
                      "top": 40,
                      "right": 111,
                      "bottom": 80,
                      "left": 80
                    }}
                    colorBy='id'
                    colors='d320c'
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
                    slicesLabelsTextColor='black'
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                  />
                </div>
              </Tab>
            </Tabs>
          )
        }
        break;
      default:
        chart.push(
          <div style={{backgroundColor: 'white', height: 450}}>
            <h5> {question.label} </h5>
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
              colorBy='id'
              colors='d320c'
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
          </div>
        );
    }

    return(
      <div style={{backgroundColor: 'white', height: 500, padding: 10}}>
        {chart}
      </div>
    )
  }
}

Chart.propTypes = {
    question: PropTypes.object.isRequired,
};

export default Chart;
