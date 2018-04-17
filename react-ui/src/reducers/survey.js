import { SET_SURVEY } from '../actions';

const initialState = {
  id: '',
  surveyName: '',
  surveyId: '',
  questions: [],
}

const survey = (state = initialState, action) => {
   switch (action.type) {
      case SET_SURVEY:
        return Object.assign({}, state, {
            id: action.survey.id,
            surveyName: action.survey.surveyName,
            surveyId: action.survey.surveyId,
            questions: action.survey.questions
        });
      default:
         return state;
   }
}

 export default survey;
