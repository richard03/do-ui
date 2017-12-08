import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
// import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
// import {
// 	HashRouter as Router,
// 	Route,
// 	Switch,
// 	browserHistory
// } from 'react-router-dom'
import {
	HashRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
// import { syncHistoryWithStore, routerReducer } from 'react-router-redux'


import Config from './Config.jsx'
import TaskList from './TaskList.jsx'
import Task from './Task.jsx'
// import Header from './Header.jsx'


const initialState = {
	name: ''
}

function loginReducer(state = initialState, action) {
	switch(action.type) {
		case 'login': return { name: action.name}
		default: return state
	}
}

const store = createStore(loginReducer)

// const store = createStore(function (state = initialState, action) {
//   combineReducers({
//     login: loginReducer,
//     routing: routerReducer
//   })
//	return state
// })

// Create an enhanced history that syncs navigation events with the store
// const history = syncHistoryWithStore(browserHistory, store)

store.dispatch({ type: 'login', name: 'richard.sery.3@gmail.com' });

// console.log(store);

// ReactDOM.render(
// 	 <Provider store={store}>
// 		<Router>
// 			<Switch>
// 				<Route exact path={Config.taskDetailScreenPath} component={Task}/>
// 				<Route render={TaskList}/>
// 			</Switch>
// 		</Router>
// 	</Provider>,
// 	document.getElementById('app')
// );

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route exact path={Config.taskDetailScreenPath} component={Task}/>
				<Route component={TaskList}/>
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('app')
);

