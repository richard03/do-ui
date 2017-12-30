import lib from '../lib.jsx'
import Config from '../Config.jsx'


const initialState = {
	position: 'unknown',
	process: 'none',
	screenId: lib.createRandomId(Config.maxId),
	parameters: {}
}

export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create(context) {
		return function navigationReducer(state = initialState, action) {
			switch (action.type) {
				case 'redirect':
					// TODO: write to browser history, to enable back-button navigation and bookmarks
			 		return Object.assign({}, state, { position: action.position, parameters: action.parameters, screenId: lib.createRandomId(Config.maxId) })

				case 'fetchTask':
					// TODO: write to browser history, to enable back-button navigation and bookmarks
					return Object.assign({}, state, { position: 'task', process: 'none', parameters: action.parameters, screenId: lib.createRandomId(Config.maxId) })


				// show taskList
				case 'submitNewTask':
				case 'resolveTask':
				case 'deleteTask':
					return Object.assign({}, state, { position: 'taskList', process: 'none', parameters: action.parameters, screenId: lib.createRandomId(Config.maxId) })



				// start process
				case 'createTask':
					// TODO: write to browser history, to enable back-button navigation and bookmarks
					return Object.assign({}, state, { position: 'task', process: 'creating new task', parameters: action.parameters, screenId: lib.createRandomId(Config.maxId) })

				case 'createSubTask':
					// TODO: write to browser history, to enable back-button navigation and bookmarks
					return Object.assign({}, state, { position: 'task', process: 'creating new subtask', parameters: action.parameters, screenId: lib.createRandomId(Config.maxId) })


				// finish process
				case 'taskCreated':
				case 'subTaskCreated':
					return Object.assign({}, state, { process: 'none' })




				default:
					return state
			}
		}
	}
}