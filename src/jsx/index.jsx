import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import {
	HashRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import Moment from 'moment'

import Config from './Config.jsx'
import TaskList from './TaskList.jsx'
import Task from './Task.jsx'
import { getQueryVariable, initAuth2, getAuth2, sendGetRequestToRestApi, sendPostRequestToRestApi } from './lib.jsx'



const initialState = {
	loginReducer: {
		loginStatus: 'unknown',
		user: {
			email: ''
		}
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

const store = createStore(combineReducers({
		loginReducer,
		siteMapReducer,
		taskListReducer,
		taskReducer
	}),
	initialState,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.dispatch({ type: 'login' });



function loginReducer(state = initialState, action) {
	
	switch (action.type) {
		case 'login':

			gapi.load('auth2', function () {
				gapi.auth2.init({
					client_id: Config.gApiKey
				}).then(onInitSuccess, onInitFailure);

				function onInitSuccess(auth) {
					let googleUser = auth.currentUser.get();
					if ( googleUser.isSignedIn() ) {
						// user already authenticated
						let googleUserProfile = googleUser.getBasicProfile();
						let user = {
							id: googleUserProfile.getId(),
							name: googleUserProfile.getName(),
							givenName: googleUserProfile.getGivenName(),
							familyName: googleUserProfile.getFamilyName(),
							imageUrl: googleUserProfile.getImageUrl(),
							email: googleUserProfile.getEmail()
						}
						store.dispatch({ type: 'setUserData', user, loginStatus: 'ok'})
					} else {
						auth.signIn({ ux_mode: 'redirect' });
						// leaving application for now, Google login screen is going to be displayed
					}
				}

				function onInitFailure() {
					// TODO - Google auth init failed
				}
			});	
			return Object.assign({}, state, { loginStatus: "initializing" });			

		case 'setUserData':
			return Object.assign({}, state, { user: action.user, loginStatus: action.loginStatus });

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
		// case 'login':
		// 	if ( store.getState().siteMapReducer.position != 'taskList' ) {
		// 		return state // do nothing
		// 	}
			// else continue, load the list
		case 'loadTaskList':
			// send request to server to start loading tasks
			sendGetRequestToRestApi( Config.apiBaseUrl + Config.apiTaskListPath, store.getState().loginReducer.user.email )
				.then( tasks => store.dispatch({ type: 'populateTaskList', tasks: tasks }) )
			return Object.assign({}, state, { taskListLoading: true });

		case 'populateTaskList':
			// populate task list after server returned the list of tasks
			return Object.assign({}, state, { tasks: action.tasks, taskListLoading: false })

		default:
			return state
	}
}

function taskReducer(state = initialState, action) {
	const taskId = action.taskId || getQueryVariable('taskid')

	switch (action.type) {

		case 'setTaskFormMode':
			return Object.assign({}, state, { mode: action.newMode })

		// case 'login':
		// 	if ( store.getState().siteMapReducer.position != 'task' ) {
		// 		return state // do nothing
		// 	}
			// else continue to fetchTask, load the task data
		case 'fetchTask': 
			if (taskId && (taskId > 0)) {
				// task exists (or at least taskId looks good)
				sendGetRequestToRestApi(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/', store.getState().loginReducer.user.email )
					.then( taskData => store.dispatch({ type: 'updateTask', task: {
							id: taskData['id'],
							title: taskData['title'],
							acceptanceCriteria: taskData['acceptance_criteria'],
							dueDate: taskData['due_date'],
							status: taskData['status'],
							priority: taskData['priority'],
							owner: taskData['owner']}
						})
					)
				return Object.assign({}, state, { mode: 'fetching' })
			}
			// else continue to createTask

 		case 'createTask':
				// task doesn't exist
				let newTask = {
					id: Math.floor(Math.random() * Config.maxId),
					status: 'open',
					title: '',
					dueDate: Moment().format(Config.apiDateTimeFormat), 
					acceptanceCriteria: '',
					priority: 1,
					owner: store.getState().loginReducer.user.email
				}
				return Object.assign({}, state, { task: newTask, mode: 'create' })
				

		case 'updateTask':
			return Object.assign({}, state, { task: action.task, mode: 'view' });

		case 'resolveTask':
			sendPostRequestToRestApi(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/', store.getState().loginReducer.user.email, { status: 'done'})
				.then( () => store.dispatch({ type: 'loadTaskList' }) )
			return Object.assign({}, state, { mode: 'resolved' });

		case 'deleteTask':
			sendDeleteRequestToRestApi(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/', store.getState().loginReducer.user.email )
				.then( () => {
					store.dispatch({ type: 'loadTaskList' })
				});
			return Object.assign({}, state, { mode: 'deleted' });

		case 'submitTask': 
			sendPostRequestToRestApi(Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.task.id + '/', store.getState().loginReducer.user.email,	{
					id: action.task.id,
					title: action.task.title,
					acceptance_criteria: action.task.acceptanceCriteria,
					due_date: action.task.dueDate,
					status: action.task.status,
					priority: action.task.priority,
					owner: action.task.owner
				})
				.then( () => {
					store.dispatch({ type: 'taskSubmitted', taskId: action.task.id })
				})
			return Object.assign({}, state, { mode: 'submitting' });

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

