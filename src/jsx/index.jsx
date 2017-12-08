import React from 'react'
import ReactDOM from 'react-dom'
// import { createStore } from 'redux'
import { createStore, combineReducers } from 'redux'
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
	loginReducer: {
		login: ''
	},
	taskReducer: {
		taskListLoading: false,
		tasks: []
	}
}

function loginReducer(state = initialState, action) {
	switch(action.type) {
		case 'login': return { login: action.login }
		default: return state
	}
}

// const store = createStore(loginReducer)
const store = createStore(combineReducers({
	 	loginReducer,
		taskReducer
	}),
	initialState
)

function taskReducer(state = initialState, action) {
	switch(action.type) {
		case 'loadTaskList':
			// send request to server to start loading tasks
			fetch(Config.apiBaseUrl + Config.apiTaskListPath)
				.then(result=>result.json())
				.then(function (tasks) {
					store.dispatch({ type: 'populateTaskList', tasks: tasks })
				})
			return { taskListLoading: true }

		case 'populateTaskList':
			// populate task list after server returned the list of tasks
			return { tasks: action.tasks, taskListLoading: false }

		case 'resolveTask':
			let postBody = new FormData();
			postBody.set('id', action.taskId);
			postBody.set('status', "done");
			fetch(Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.taskId + '/', { 
				method: 'POST',
				body: postBody
			}).then(function (tasks) {
				store.dispatch({ type: 'loadTaskList' })
			});

		// case 'submitTask': 

	 // 		let postBody = new FormData();
	 // 		// task mapping
		// 	postBody.set('id', state.id);
		// 	postBody.set('title', state.title);
		// 	postBody.set('acceptance_criteria', state.acceptanceCriteria);
		// 	postBody.set('due_date', state.dueDate);
		// 	postBody.set('status', state.status);
		// 	postBody.set('priority', state.priority);
		// 	postBody.set('owner', state.name);

		// 	const url = Config.apiBaseUrl + Config.apiTaskListPath + '/' + state.id + '/'

		// 	fetch(url, {
		// 			method: 'POST',
		// 			body: postBody
		// 		}).then(function () {
		// 			return state
		// 		})
		// 	break
		default: return state
	}	
}






// Create an enhanced history that syncs navigation events with the store
// const history = syncHistoryWithStore(browserHistory, store)



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

