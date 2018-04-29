import { SET_SURVEY } from '../actions';

const initialState = {
  id: '',
  surveyName: '',
  author: '',
  details: '',
  surveyId: '',
  questions: [],
}

const survey = (state = initialState, action) => {
   switch (action.type) {
      case SET_SURVEY:
        return Object.assign({}, state, {
            id: action.survey.id,
            author: action.survey.author,
            details: action.survey.details,
            surveyName: action.survey.surveyName,
            surveyId: action.survey.surveyId,
            questions: action.survey.questions
        });
      default:
         return state;
   }
}

 export default survey;
