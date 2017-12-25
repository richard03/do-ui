import Config from '../Config.jsx'


const initialState = {
	position: 'unknown',
	parameters: {}
}

export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create(context) {
		return function siteMapReducer(state = initialState, action) {
			switch (action.type) {
				case 'redirect':

			// 		switch (action.newPosition) {
			// 			case 'taskList':
			// 				context.history.push(Config.taskListScreenPath)
			// 				break;
			// 			case 'task':
			// 				if (action.params.taskid) {
			// 					context.history.push(Config.taskDetailScreenPath + '?taskid=' + action.params.taskid)
			// 				} else {
			// 					context.history.push(Config.taskDetailScreenPath)
			// 				}
			// 		}
			 		return Object.assign({}, state, { position: action.position, parameters: action.parameters })
			 	default:
					return state
			}
		}
	}
}