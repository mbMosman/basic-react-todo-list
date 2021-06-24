import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import './index.css';
import App from './components/App/App';
import todoWatcher from './redux/todo.watcher.saga';
import categoryList from './redux/category.reducer';
import taskList from './redux/task.reducer';


const sagaMiddleware = createSagaMiddleware();

// Don't include logger in Redux middleware unless in development mode
const middlewareList = process.env.NODE_ENV === 'development' ?
  [sagaMiddleware, logger] :
  [sagaMiddleware];

const store = createStore(
  // add each of the reducers to the store
  combineReducers({
    taskList,
    categoryList,
  }),
  // adds listed middleware to the store
  applyMiddleware(...middlewareList),
);

// Setup the taskWatcher in the saga middleware 
sagaMiddleware.run(todoWatcher);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);