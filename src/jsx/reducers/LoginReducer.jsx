
const initialState = {
	login: null
}

export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create() {
		return function loginReducer(state = initialState, action) {
			switch (action.type) {
				case 'login':

					return Object.assign({}, state, { 
						login: action.login 
					})
				default:
					return state
			}
		}
	}
}