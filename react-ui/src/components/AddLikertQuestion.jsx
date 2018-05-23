import React, {Component} from 'react'
import {Input, Row} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

const $ = window.$;

class AddLikertQuestion extends Component{
  constructor(props){
    super(props);
    this.state={
      type: 'Agreement',
      scale: 5,
      support: [],
      contradict: []
    }
  }

  componentDidMount(){
    const { question, survey } = this.props;
    if(question){
      let scale = question.options.length;
      let ar = question.defaultValue.split(':');
      let type = ar[2];
      let support =_.compact(ar[0].split(','))
      let contradict =  _.compact(ar[1].split(','));
      let id = '-'+question.id;
      this.setState({scale:scale, support:support, contradict:contradict, type:type});
    }
    let id = question? '-'+question.id : '';
    $('#options'+id).on('change keyup keydown paste cut', 'textarea', function () {
        $(this).height(0).height(this.scrollHeight);
    }).find('textarea').change();
  }

  componentDidUpdate(){
    const { question } = this.props;
    const { support} = this.state;
    if(question){
      let ar = question.defaultValue.split(':');
      let support =_.compact(ar[0].split(','))
      let contradict =  _.compact(ar[1].split(','));
      let id = '-'+question.id;
      support.forEach((i) => {
        $('#addModal-su-'+i+id).prop('checked', true);
      })
      contradict.forEach((i) => {
        $('#addModal-cn-'+i+id).prop('checked', true);
      })
    }
  }

  toggleCheckBox(e, num, id){
    let checked = $(id).is(':checked');
    if(_.includes(id, 'su')){
      if(checked)
        this.setState({support: _.concat(this.state.support, [num+''])});
      else
        this.setState({support: _.without(this.state.support, num+'')});
    } else {
      if(checked)
        this.setState({contradict: _.concat(this.state.contradict, [num+''])});
      else
        this.setState({contradict: _.without(this.state.contradict, num+'')});
    }
  }

  changeState(attr, id){
    if(attr == 'type')
      this.setState({type: $(id).val()});
    else
      this.setState({scale: $(id).val()});
  }

  render() {
    const {scale, type, support, contradict} = this.state;
    const {survey, question} = this.props;
    let value = '';

    const su = [];
    const cn = [];

    const id = question? '-'+question.id : '';
    switch(type){
      case 'Agreement':
        if(scale==5)
          value = 'Strongly Disagree\nDisagree\nNeither agree nor disagree\nAgree\nStrongly Agree';
        else if(scale==7)
          value = 'Very Strongly Disagree\nStrongly Disagree\nDisagree\nNeither agree nor disagree\nAgree\nStrongly Agree\nVery Strongly Agree';
        else
          value = 'Extremely Disagree\nVery Strongly Disagree\nStrongly Disagree\nDisagree\nNeither agree nor disagree\nAgree\nStrongly Agree\nVery Strongly Agree\nExtremely Agree';
        break;
      case 'Frequency':
        if(scale==5)
          value = 'Never\nAlmost Never\nOccasionally\nAlmost Everytime\nEverytime';
        else if(scale==7)
          value = 'Never\nRarely\nSometimes\nOccasionally\nFrequently\nUsally\nEverytime';
        else
          value = 'Never\nAlmost Never\nRarely\nSometimes\nOccasionally\nFrequently\nUsally\nAlmost Everytime\nEverytime';
        break;
      case 'Satisfaction':
        if(scale==5)
          value = 'Unsatisfied\nSlightly Unsatisfied\nNeutral\nSlightly Satisfied\nSatisfied';
        else if(scale==7)
          value = 'Highly Unsatisfied\nUnsatisfied\nSlightly Unsatisfied\nNeutral\nSlightly Satisfied\nSatisfied\nHighly Satisfied';
        else
          value = 'Extremely Unsatisfied\nHighly Unsatisfied\nUnsatisfied\nSlightly Unsatisfd\nNeutral\nSlightly Satisfied\nSatisfied\nHighly Satisfied\nExtremely Satisfied';
        break;
      default:
        if(scale==5)
          value = 'Not Important\nSlightly Not Important\nNeutral\nSlightly Important\nImportant';
        else if(scale==7)
          value = 'Highly Not Important\nNot Important\nSlightly Not Important\nNeutral\nSlightly Important\nImportant\nHighly Important';
        else
          value = 'Extremely Not Important\nHighly Not Important\nNot Important\nSlightly Not Important\nNeutral\nSlightly Important\nImportant\nHighly Important\nExtremely Important';
    }

    su.push(<h6> This question supports question number(s): </h6>)
    cn.push(<h6> This question contradicts question number(s): </h6>)

    for(let i = 1 ; i <= survey.questions.length ; i++){
      if(question && survey.questions[i-1].id == question.id){
        continue;
      }
      su.push(<Input disabled={_.includes(contradict, i+'')} key={'addModal-su-'+i+id} id={'addModal-su-'+i+id} onChange={(e) => this.toggleCheckBox(e, i, '#addModal-su-'+i+id) } type='checkbox' label={i}/>);
      cn.push(<Input disabled={_.includes(support, i+'')} key={'addModal-cn-'+i+id} id={'addModal-cn-'+i+id} onChange={(e) => this.toggleCheckBox(e, i, '#addModal-cn-'+i+id) } type='checkbox' label={i}/>);
    }

    return(
      <Row>
        <Input id={'likertType'+id} s={12}  onChange={ (e) => this.changeState('type', '#likertType'+id)} type='select' label='Likert Scale Type' value={type}>
          <option value='Agreement'>Agreement</option>
          <option value='Frequency'>Frequency</option>
          <option value='Satisfaction'>Satisfaction</option>
          <option value='Importance'>Importance</option>
        </Input>
        <Input id={'scale'+id} type='number' s={12} onChange={ (e) => this.changeState('scale', '#scale'+id)} label='Number of Points' value={scale} defaultValue='5' min='5' max='9' step='2'/>
        <Row>
          <h5> Options </h5>
          <Row style={{marginLeft: 10, padding: 5, backgroundColor: '#e8eaed'}}>
            {value.split('\n').map((v) => {
              return (<p> {v} </p>)
            })}
          </Row >
        </Row>
        <Row>
          {su}
        </Row>
        <Row>
          {cn}
        </Row>
        <Row>
          <Input hidden type='textarea' id={'options'+id} value={value}/>
          <Input hidden id={'supports'+id} value={support.join(',')}/>
          <Input hidden id={'contradicts'+id} value={contradict.join(',')}/>
        </Row>
      </Row>
    )
  }
}

AddLikertQuestion.propTypes = {
    survey: PropTypes.object.isRequired,
    question: PropTypes.object
};

export default connect(
    state => ({ survey: state.survey })
)(AddLikertQuestion);
