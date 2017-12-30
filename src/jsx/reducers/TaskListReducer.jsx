import lib from '../lib.jsx'
import Config from '../Config.jsx'

const initialState = {
	taskListLoading: false,
	tasks: {}
}


export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create(context) {
		return function taskListReducer(state = initialState, action) {

			let tasks = Object.assign({}, state.tasks)

			switch (action.type) {

				case 'redirect':
					// enforce update upon redirect
					if (action.position == 'taskList') {
						// enforce update upon redirect
						return loadTaskListAction(state, action, context)
					}
					return state


				case 'loadTaskList':
					// send request to server to start loading tasks
					return loadTaskListAction(state, action, context)
					

				case 'taskSubmitted':
					tasks[action.task.id] = action.task
					return Object.assign({}, state, { tasks })


				case 'taskDeleted':
				case 'taskResolved':
					delete tasks[action.taskId]
					return Object.assign({}, state, { tasks })
				

				case 'populateTaskList':
					// populate task list after server returned the list of tasks
					return Object.assign({}, state, { tasks: action.tasks, taskListLoading: false })



				case 'submitTasks':
					action 

				default:
					return state
			}
		}
	}
}