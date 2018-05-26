import React, {Component} from 'react'
import {PropTypes}  from 'prop-types';
import {Button, Modal, Input  , Row, Preloader, Table, Navbar, NavItem} from 'react-materialize';
import { connect } from 'react-redux';
import { createSurvey } from './../actions/index';
import styles from './../stylesheets/Home.css';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import _ from 'lodash';

import { login, check, logOut } from './../actions/index';

const Materialize = window.Materialize;
const $ = window.$;

class User extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {},
      surveys: [],
      surveyName: '',
      surveyId: '',
    };
  }

  componentWillMount(){
    this.props.check().then((user)=>{
      if(user.code === 200){
        fetch('/api/survey/author/'+user.user.email)
        .then((res) => res.json())
        .then((surveys) => {
          this.setState({isLoading:false, user:user.user, surveys: surveys});
        })
      }
      else {
        window.location = '/';
      }
    });
  }

  remove(survey){
    if(!window.confirm('Are you sure you want to delete this survey?')) return;
    let id = survey.id;
    fetch('/api/survey/cancel/'+id, {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }).then((res) => {
      if(res.status === 200){
        Materialize.toast('Successfully deleted survey', 2000, 'green lighten-1');
        this.setState({surveys: _.without(this.state.surveys, survey)});
      } else
        Materialize.toast('Error deleting survey', 2000, 'red lighten-1')
    })
  }

  edit(survey){
    if(survey.responseCount === 0)
      window.location = '/design-survey/'+survey.id;
    else
      alert('Survey already has responses. Can no longer edit this survey');
  }

  logoutFxn = () =>  {
    this.props.logOut().then((res) => {
      if(res.code === 200)
        window.location = '/'
    });

  }

  createSurveyEvent (e){
    e.preventDefault();
    let newSurvey = {
      surveyName: $('#surveyName').val(),
      author: this.state.user.email,
      details: $('#surveyDetails').val()
    }
    this.props.createSurvey(newSurvey).then((res) => {
      if(this.props.survey.id)
        window.location = '/design-survey/' + this.props.survey.id;
      else
        Materialize.toast('Error creating survey', 5000, 'red lighten-1');
    })
  }

  render() {
    if(this.state.isLoading)
      return(
        <Row style={{width:'100%', marginTop: '25%'}} className="center">
            <Preloader size='big'/>
            <h1> Loading User </h1>
        </Row>
      )

    const {surveys, surveyName} = this.state;

    const filteredSurveys = _.filter(surveys, function(s) { return ( s.surveyName.includes(surveyName)) });
    let data = filteredSurveys.map((survey) => {
      let temp = {};
      temp.label = survey.surveyName;
      temp.surveyId = survey.surveyId;
      temp.actions = [];
      temp.actions.push(<Button small style={{margin: 5}} className='blue' onClick={() => window.location = '/view-result/'+survey.id} waves='light'> View Result </Button>);
      temp.actions.push(<Button small style={{margin: 5}} className='green' onClick={() => this.edit(survey)} waves='light'> Edit Survey </Button>);
      temp.actions.push(<Button small style={{margin: 5}} className='red' onClick={() => this.remove(survey)} waves='light'> Delete Survey </Button>);
      return temp;
    });

    let columns = [
      {Header: 'Survey Title', accessor: 'label', width: 500},
      {Header: 'Survey Id', accessor: 'surveyId', width: 200},
      {Header: 'Options', accessor: 'actions', width: 600}
    ]

    return(
      <div>
        <Navbar style={{backgroundColor: '#b27b05'}} brand='CenterPoint' right>
          <NavItem onClick={this.logoutFxn}>  Logout </NavItem>
        </Navbar>
        <div>
          <Row style={{backgroundColor: 'white', paddingTop: 50, width:'80%'}}>
            <Modal header='Create New Survey' trigger={<Button className='createSurvey btn-large waves-effect waves-light amber darken-3'>Create New Survey</Button>}>
              <form onSubmit={(e) => this.createSurveyEvent(e) }>
                <Input id='surveyName' required='true' label='Survey Title'/>
                <Input type='textarea' id='surveyDetails' label='Details (short description of the survey)'/>
                <Input className='btn blue-grey darken-1' type='submit'/>
              </form>
            </Modal>
            <Row>
              <Input onChange={(e)=>{this.setState({surveyName: $('#filterName').val()})}} id='filterName'  label='Filter By Survey Title'/>
            </Row>
            <ReactTable data={data} columns={columns} defaultPageSize={10} className="-striped -highlight" sortable={false}/>
          </Row>
        </div>
      </div>
    )
  }
}

User.propTypes = {
  survey: PropTypes.object.isRequired,
  createSurvey: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  check: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired
};

export default connect(
  state => ({ survey: state.survey }),
  { createSurvey, login, check, logOut}
)(User)
