import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import { sessionService } from 'redux-react-session';
import rootReducer from './reducers';


import * as Containers from './containers/index';
const store = createStore(rootReducer, applyMiddleware(thunk));
const options = { refreshOnCheckAuth: true, redirectPath: '/home', driver: 'COOKIES' };

sessionService.initSessionService(store, options)
  .then(() => console.log('Redux React Session is ready and a session was refreshed from your storage'))
  .catch(() => console.log('Redux React Session is ready and there is no session in your storage'));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Containers.Home} />
        <Route exact path='/user' component={Containers.User} />
        <Route exact path='/design-survey/:id' component={Containers.DesignSurvey} />
        <Route exact path='/view-result/:id' component={Containers.ViewResult} />
        <Route exact path='*' component={Containers.NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
