import lib from '../lib.jsx'
import Config from '../Config.jsx'

const initialState = {
	taskListLoading: false,
	tasks: []
}


export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create(context) {
		return function taskListReducer(state = initialState, action) {
			switch (action.type) {

				case 'loadTaskList':
					// send request to server to start loading tasks
					lib.sendGetRequestToRestApi({
								url: Config.apiBaseUrl + Config.apiTaskListPath,
								login: context.store.getState().loginReducer.login
							})
						.then(
							tasks => context.store.dispatch({ type: 'populateTaskList', tasks: tasks }),
							() => context.store.dispatch({ type: 'reportFailure' })
						)
					return Object.assign({}, state, { taskListLoading: true });

				case 'populateTaskList':
					// populate task list after server returned the list of tasks
					return Object.assign({}, state, { tasks: action.tasks, taskListLoading: false })

				default:
					return state
			}
		}
	}
}