import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import survey from './survey';

const Reducers = combineReducers({
    survey: survey,
    routing: routerReducer
});

export default Reducers;
