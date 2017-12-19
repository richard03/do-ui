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
import { getQueryVariable, initAuth2, getAuth2, sendGetRequestToRestApi, sendPostRequestToRestApi, sendDeleteRequestToRestApi } from './lib.jsx'




gapi.load('auth2', function () {
	gapi.auth2.init({
		client_id: Config.gApiKey
	}).then(onAuthSuccess, onAuthFailure);
});


function onAuthSuccess(auth) {
	let googleUser = auth.currentUser.get();
	if ( googleUser.isSignedIn() ) {
		// user already authenticated
		let googleUserProfile = googleUser.getBasicProfile();
		let authResponse = googleUser.getAuthResponse(true);
		let login = Object.assign({}, authResponse, {
				id: googleUserProfile.getId(),
				name: googleUserProfile.getName(),
				givenName: googleUserProfile.getGivenName(),
				familyName: googleUserProfile.getFamilyName(),
				imageUrl: googleUserProfile.getImageUrl(),
				email: googleUserProfile.getEmail()
			});
		init(auth, login);
	} else {
		auth.signIn({ ux_mode: 'redirect' });
		// leaving application for now, Google login screen is going to be displayed
	}
}

function onAuthFailure() {
	// TODO - Google auth init failed
}


function init(auth, login) {

	const initialState = {
		loginReducer: {
			loginStatus: 'unknown',
			auth,
			login
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
				acceptanceCriteria: [],
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
		window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
	)

	function loginReducer(state = initialState, action) {
		return state
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

			case 'loadTaskList':
				// send request to server to start loading tasks
				sendGetRequestToRestApi({
							url: Config.apiBaseUrl + Config.apiTaskListPath,
							login: store.getState().loginReducer.login
						})
					.then(
						tasks => store.dispatch({ type: 'populateTaskList', tasks: tasks }),
						() => store.dispatch({ type: 'reportFailure' })
					)
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

			case 'fetchTask':
				if (taskId && (taskId > 0)) {
					// task exists (or at least taskId looks good)
					sendGetRequestToRestApi({
							url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/',
							login: store.getState().loginReducer.login })
						.then( taskData => store.dispatch({
								type: 'updateTask',
								task: {
									id: taskData['id'],
									title: taskData['title'],
									acceptanceCriteria: JSON.parse(taskData['acceptance_criteria']),
									dueDate: taskData['due_date'],
									status: taskData['status'],
									priority: taskData['priority'],
									owner: taskData['owner']
								}
							}),
							() => store.dispatch({ type: 'reportFailure' })
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
					acceptanceCriteria: [ { checked: false, description: "" } ],
					priority: 1,
					owner: store.getState().loginReducer.login.email
				}
				return Object.assign({}, state, { task: newTask, mode: 'create' })


			case 'updateTask':
				return Object.assign({}, state, { task: action.task, mode: 'view' });

			case 'resolveTask':
				sendPostRequestToRestApi({
							url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/',
							login: store.getState().loginReducer.login
						}, {
							status: 'done'
						})
					.then(
						() => store.dispatch({ type: 'loadTaskList' }),
						() => store.dispatch({ type: 'reportFailure' })
					)
				return Object.assign({}, state, { mode: 'resolved' });

			case 'deleteTask':
				sendDeleteRequestToRestApi({
							url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/',
							login: store.getState().loginReducer.login
						})
					.then( () => {
						store.dispatch({ type: 'loadTaskList' }),
						() => store.dispatch({ type: 'reportFailure' })
					});
				return Object.assign({}, state, { mode: 'deleted' });

			case 'submitTask':
				sendPostRequestToRestApi({
							url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.task.id + '/',
							login: store.getState().loginReducer.login
						}, {
							id: action.task.id,
							title: action.task.title,
							acceptance_criteria: JSON.stringify(action.task.acceptanceCriteria),
							due_date: action.task.dueDate,
							status: action.task.status,
							priority: action.task.priority,
							owner: store.getState().loginReducer.login.email
						})
					.then( () => {
						store.dispatch({ type: 'taskSubmitted', taskId: action.task.id }),
						() => store.dispatch({ type: 'reportFailure' })
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

}
