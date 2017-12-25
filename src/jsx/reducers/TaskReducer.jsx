import lib from '../lib.jsx'
import Config from '../Config.jsx'
import Moment from 'moment'


const initialState = {
	mode: 'initializing',
	task: {
		id: null,
		// status: 'new',
		// title: '',
		// dueDate: Moment().format(Config.apiDateTimeFormat),
		// acceptanceCriteria: [],
		// priority: 1,
		// owner: ''
	}
}



export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create(context) {
		return function taskReducer(state = initialState, action) {
			const task = state.task

			switch (action.type) {

				case 'setTaskFormMode':
					return Object.assign({}, state, { mode: action.newMode })

				case 'fetchTask':
					lib.sendGetRequestToRestApi({
							url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.taskId + '/',
							login: context.store.getState().loginReducer.login })
						.then( taskData => context.store.dispatch({
								type: 'updateTask',
								task: {
									id: taskData['id'],
									title: taskData['title'],
									acceptanceCriteria: JSON.parse(taskData['acceptance_criteria']).map( (item) => ({ // mapping takes care of poor data quality
								 		passed: item.passed || false,
										description: item.description || ''
									}) ),
									dueDate: taskData['due_date'],
									status: taskData['status'],
									priority: taskData['priority'],
									owner: taskData['owner']
								}
							}),
							() => context.store.dispatch({ type: 'reportFailure' })
						)
					return Object.assign({}, state, { mode: 'fetching' })

		 		case 'createTask':
					// task doesn't exist
					let newTask = {
						id: Math.floor(Math.random() * Config.maxId),
						status: 'open',
						title: '',
						dueDate: Moment().format(Config.apiDateTimeFormat),
						acceptanceCriteria: [],
						priority: 1,
						owner: context.store.getState().loginReducer.login.email
					}
					return Object.assign({}, state, { task: newTask, mode: 'create' })

				case 'updateTask':
					if (state.mode == 'create') {
						return Object.assign({}, state, { task: action.task })
					} else {
						return Object.assign({}, state, { task: action.task, mode: 'read' })
					}


				case 'resolveTask':
					lib.sendPostRequestToRestApi({
								url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.taskId + '/',
								login: context.store.getState().loginReducer.login
							}, {
								status: 'done'
							})
						.then(
							() => context.store.dispatch({ type: 'loadTaskList', dispatch: context.store.dispatch }),
							() => context.store.dispatch({ type: 'reportFailure' })
						)
					return Object.assign({}, state, { mode: 'resolved' });

				case 'deleteTask':
					lib.sendDeleteRequestToRestApi({
								url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.taskId + '/',
								login: context.store.getState().loginReducer.login
							})
						.then( () => {
							context.store.dispatch({ type: 'loadTaskList', dispatch: context.store.dispatch }),
							() => context.store.dispatch({ type: 'reportFailure' })
						});
					return Object.assign({}, state, { mode: 'deleted' });

				case 'submitTask':
					lib.sendPostRequestToRestApi({
								url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + action.task.id + '/',
								login: context.store.getState().loginReducer.login
							}, {
								id: action.task.id,
								title: action.task.title,
								acceptance_criteria: JSON.stringify(action.task.acceptanceCriteria),
								due_date: action.task.dueDate,
								status: action.task.status,
								priority: action.task.priority,
								owner: context.store.getState().loginReducer.login.email
							})
						.then( () => {
							context.store.dispatch({ type: 'taskSubmitted', taskId: action.task.id }),
							() => context.store.dispatch({ type: 'reportFailure' })
						})
					if ( action.operation == 'create' ) {
						return Object.assign({}, state, { mode: 'submitting' })
					} else {
						return Object.assign({}, state, { mode: 'submittingUpdate' })
					}

				case 'taskSubmitted':
					// todo: write message about it
					return Object.assign({}, state, { mode: 'read' });

				default:
					return state
			}
		}
	}
}