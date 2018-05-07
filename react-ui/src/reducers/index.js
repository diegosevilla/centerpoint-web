import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { sessionReducer } from 'redux-react-session';
import survey from './survey';

const Reducers = combineReducers({
    survey: survey,
    routing: routerReducer,
    session: sessionReducer
});

export default Reducers;
