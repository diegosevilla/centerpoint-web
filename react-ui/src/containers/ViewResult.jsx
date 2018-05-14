import React, {Component} from 'react';
import {PropTypes}  from 'prop-types';
import {Button, Row, Col, Input, Preloader, Tabs, Tab, Pagination} from 'react-materialize';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../stylesheets/CreateSurvey.css';
import Chart from '../components/Chart';
import { fetchSurvey } from '../actions/index';

const $ = window.$;

class ViewResult extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      questions: [],
      page: 1,
      active: 0,
      locations: [[''], [''], ['']],
      filter: {0: '', 1: '', 2: ''}
    };
  }

  componentDidMount(){
    let id = window.location.pathname.replace(/\/view-result\//, '');
    this.props.fetchSurvey(id)
    .then(()=>{
      if(this.props.survey.id === -1){
        alert('Invalid Survey!');
        window.location = '/';
      } else {
        fetch('/api/answer/survey/'+id)
        .then((res) => res.json())
        .then((responses) => {
          let temp = [];
          let tempAnswers = responses.answers;
          let tempLoc = [[''], [''], ['']];
          tempAnswers.forEach((answer) => {
            let loc = answer.location.split(',');
            for(let i = 0 ; i < 3 ; i++){
              if(!_.includes(tempLoc[i], loc[i]))
                tempLoc[i].push(loc[i]);
            }
            let r = _.find(temp, {responseCount: answer.responseCount, question_id: answer.question_id});
            if(!r)
              temp.push(answer);
            else{
              r.response += ', ' + answer.response
            }
          })
          let data = _.groupBy(temp, function(a){return a.responseCount});
          this.setState({isLoading: false, data, questions: responses.questions, locations: tempLoc });
        })
      }
    })
  }

  render() {
    const { survey } = this.props;
    const { data, questions, isLoading, page, locations, filter } = this.state;
    let  dataAnalysis = [];
    let actualResponses  = [];

    let options = [];

    options.push(
      <Col style={{'height': '100px', 'textAlign': 'center'}}>
          Filter By Location
      </Col>
    );
    for(let i = 0 ; i < locations.length ; i++){
      let loc = locations[i];
      let tempOp = [];
      loc.forEach((o) => {
        tempOp.push(<option value={o}> {o} </option>);
      });

      options.push(
        <Col style={{'height': '100px', 'textAlign': 'center'}}>
          <Input id={'op'+i} style={{'width':'50px', 'marginBottom': '10%'}} onChange={(val) => {
            let temp = filter;
            temp[i] = $('#op'+i).val();
            this.setState({filter:temp})
          }} type='select'>
            {tempOp}
          </Input>
        </Col>
      );
    };

    console.log(this.state);
    if(Object.keys(data).length !== 0){
      let responses = data[page];
      //responses = _.filter(responses, function(r) { _.includes(r.location, filter[0]) && _.includes(r.location, filter[1]) && _.includes(r.location, filter[2])});
      responses = _.sortBy(responses,[function(r) { return r.question_id; }]);
      actualResponses.push(<h4 className='center'> Response # {page} </h4>);
      responses.forEach((response) => {
        let q = _.find(questions, {id: response.question_id})
        actualResponses.push(
          <div className='center' style={{ marginLeft: '30%', marginBottom: 20, paddingTop: 10, height: 120, width: '40%', borderStyle: 'solid', borderColor: 'black', backgroundColor: '#ededff'}}>
            <h4 className='center'> {q.label} </h4>
            <h5 className='center'>{response.response}</h5>
          </div>
        );
      });
    } else
      actualResponses.push(
        <div className='center' style={{backgroundColor: 'white', height: 500, padding: 10}}>
          <h5> No Results Yet </h5>
        </div>
      )

    let sortedQuestions = _.sortBy(this.props.survey.questions, (questions) => {
         return questions.id;
     });

     sortedQuestions.forEach((q) => {
       dataAnalysis.push(
         <div style={{
            padding: '10px',
            width: '50%',
            marginLeft: '25%',
            marginRight: '25%',
            marginTop: '2%',
            marginBottom: '2%',
            height: '550px',
            backgroundColor: '#fcc2a1',
            textAlign: 'center'
         }} >
          <Chart key={q.id} question={q}/>
         </div>
       )
     })

    if(isLoading)
      return(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
            <Preloader size='big'/>
            <h1> Fetching Results </h1>
        </Row>
      )
    else
    return(
      <div className='bgCS'>
        <div>
          <div className="resultHeader center ">
              <div className="home center">
                <Button floating large className='teal darken-2' waves='light' icon='home' onClick={(e) => {e.preventDefault() ; window.location = '/user'}}/>
              </div>
              <br/>
              <div className="resultTitle center">
                <h4> {survey.surveyName} </h4>
                <h5> {'By: ' + survey.author} </h5>
                <Row style={{paddingLeft: '25%', width:'100%'}} className='center'>
                  {options}
                </Row>
              </div>
          </div>
         <Row className="resultBody">
            <Tabs className='z-depth-1' onChange={(val) => this.setState({active:val})}>
              <Tab title="Actual Responses" active={this.state.active%2 === 0}>
                <Pagination onSelect={(val) => this.setState({page:val})} className='center' items={Object.keys(data).length} activePage={this.state.page} maxButtons={10} />
                <div style={{backgroundColor: 'white', padding: 20}}>
                  {actualResponses}
                </div>
              </Tab>
              <Tab title="Data Analysis"  active={this.state.active%2 === 1}>
              {dataAnalysis}
              </Tab>
            </Tabs>
         </Row>
        </div>
      </div>
    )
  }
}

ViewResult.propTypes = {
    survey: PropTypes.object.isRequired,
    fetchSurvey: PropTypes.func.isRequired,
};
export default connect(
    state => ({ survey: state.survey }),
    { fetchSurvey }
)(ViewResult);
