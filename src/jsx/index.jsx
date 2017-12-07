import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import {
	HashRouter as Router,
	Route,
	Switch,
	browserHistory
} from 'react-router-dom'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'


import Config from './Config.jsx'
import TaskList from './TaskList.jsx'
import Task from './Task.jsx'


function loginReducer(state = {}, action) {
	switch(action.type) {
		case 'setUser': return {userName: action.userName}
		default: return state
	}
}

const store = createStore(
  combineReducers({
    login: loginReducer,
    routing: routerReducer
  })
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

store.dispatch({ type: 'setUser', userName: 'richard.sery.3@gmail.com' });

console.log(store);

ReactDOM.render(
	 <Provider store={store}>
		<Router>
			<Switch>
				<Route exact path={Config.taskDetailScreenPath} component={Task}/>
				<Route render={TaskList}/>
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('app')
);

