import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import rootReducer from './reducers';


import * as Containers from './containers/index';
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Containers.Home} />
        <Route exact path='/create-survey/:id' component={Containers.CreateSurvey} />
        <Route exact path='/view-result/:id' component={Containers.ViewResult} />
        <Route exact path='*' component={Containers.NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
