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
import Moment from 'moment'

import Config from './Config.jsx'
import TaskList from './TaskList.jsx'
import Task from './Task.jsx'
import { getQueryVariable } from './lib.jsx'



const initialState = {
	loginReducer: {
		login: ''
	},
	siteMapReducer: {
		position: 'unknown'
	},
	taskListReducer: {
		taskListLoading: false,
		tasks: []
	},
	taskReducer: {
		mode: 'initializing',
		task: {
			id: -1,
		 	status: 'new',
		 	title: '',
		 	dueDate: Moment().format(Config.apiDateTimeFormat),
		 	acceptanceCriteria: '',
		 	priority: 1,
		 	owner: '',
		}
	}
}

// const store = createStore(loginReducer)
const store = createStore(combineReducers({
		loginReducer,
		siteMapReducer,
		taskListReducer,
		taskReducer
	}),
	initialState,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


function loginReducer(state = initialState, action) {
	switch (action.type) {
		case 'login': 
			return Object.assign({}, state, { login: action.login });
		default:
			return state
	}
}

function siteMapReducer(state = initialState, action) {
	switch (action.type) {
		case 'setSiteMapPosition':
			return Object.assign({}, state, { position: action.newPosition });
		default:
			return state;
	}
}

function taskListReducer(state = initialState, action) {
	switch (action.type) {
		case 'login':
			if ( store.getState().siteMapReducer.position != 'taskList' ) {
				return state // do nothing
			}
			// else continue, load the list
		case 'loadTaskList':
			// send request to server to start loading tasks
			fetch(Config.apiBaseUrl + Config.apiTaskListPath)
				.then(result=>result.json())
				.then(function (tasks) {
					store.dispatch({ type: 'populateTaskList', tasks: tasks })
				})
			return Object.assign({}, state, { taskListLoading: true });

		case 'populateTaskList':
			// populate task list after server returned the list of tasks
			return Object.assign({}, state, { tasks: action.tasks, taskListLoading: false });

		default:
			return state
	}	
}

function taskReducer(state = initialState, action) {
	const taskId = action.taskId || getQueryVariable('taskid');

	switch (action.type) {

		case 'setTaskFormMode':
			return Object.assign({}, state, { mode: action.newMode });

		case 'login':
console.log('login');
			if ( store.getState().siteMapReducer.position != 'task' ) {
				return state // do nothing
			}
console.log('got to fetch');
			// else continue to fetchTask, load the task data
		case 'fetchTask': 
// 		( function () { // start separate namespace
// console.log('fetching');
// 				// const oldTask = store.getState().taskReducer.task;
 				if (taskId && (taskId > 0)) {
 					// task exists (or at least taskId looks good)
 					fetch(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/')
 						.then(result=>result.json())
 						.then((taskData) => {
 							// task mapping
							let task = {};
							task.id = taskData['id'];
							task.title = taskData['title'];
							task.acceptanceCriteria = taskData['acceptance_criteria'];
							task.dueDate = taskData['due_date'];
							task.status = taskData['status'];
							task.priority = taskData['priority'];
							task.owner = taskData['owner'];
 							// end task mapping
 							store.dispatch({ type: 'updateTask', task });
 						});
 					// return Object.assign({}, state, { mode: 'fetching' });
 					return Object.assign({}, state, { mode: 'fetching' });
 				} else {
// console.log('creating');
// 					// task doesn't exist
					let newTask = {
						id: Math.floor(Math.random() * Config.maxId),
						status: 'open',
						title: '',
						dueDate: Moment().format(Config.apiDateTimeFormat), 
						acceptanceCriteria: '',
						priority: 1,
						owner: store.getState().loginReducer.login
					}
					return Object.assign({}, state, { task: newTask, mode: 'edit' });
 				}

// 			})(); // end separate namespace

		case 'updateTask':
// console.log(action.task);
			return Object.assign({}, state, { task: action.task, mode: 'view' });

		case 'resolveTask': ( function() { // start separate namespace
				let postBody = new FormData();
				postBody.set('status', "done");
				fetch(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/', { 
					method: 'POST',
					body: postBody
				}).then(function (tasks) {
					store.dispatch({ type: 'loadTaskList' })
				});
			} )(); // end separate namespace
			return Object.assign({}, state, { mode: 'resolved' });

		case 'deleteTask':
			fetch(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/', {
					method: 'DELETE'
				}).then(function (result) {
					store.dispatch({ type: 'loadTaskList' })
				});
			return Object.assign({}, state, { mode: 'deleted' });

		case 'submitTask': ( function() {  // start separate namespace
		 		let postBody = new FormData();
				postBody.set('id', action.task.id);
				postBody.set('title', action.task.title);
				postBody.set('acceptance_criteria', action.task.acceptanceCriteria);
				postBody.set('due_date', action.task.dueDate);
				postBody.set('status', action.task.status);
				postBody.set('priority', action.task.priority);
				postBody.set('owner', action.task.owner);
				fetch(Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.task.id + '/', {
						method: 'POST',
						body: postBody
					}).then(function () {
						store.dispatch({ type: 'taskSubmitted', taskId: action.task.id })
					})
					return Object.assign({}, state, { mode: 'submitting' });
			 } ) (); // end separate namespace

		case 'taskSubmitted':

			// taskComponent.props.history.push(Config.taskListScreenPath);
			// todo: write message about it
			return Object.assign({}, state, { mode: 'view' });

		default:
			return state
	}	
}

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

