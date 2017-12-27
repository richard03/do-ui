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
			 		return Object.assign({}, state, { position: action.position, parameters: action.parameters })
			 	default:
					return state
			}
		}
	}
}