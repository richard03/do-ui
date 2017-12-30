import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

// import {
// 	Router,
// 	Route,
// 	Switch
// } from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory'
// import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Config from './Config.jsx'

import Application from './Application.jsx'

import LoginReducer from './reducers/LoginReducer.jsx'
import NavigationReducer from './reducers/NavigationReducer.jsx'
import TaskReducer from './reducers/TaskReducer.jsx'

const globals = {}

const store = createStore(combineReducers({
		loginReducer: LoginReducer.create(),
		navigationReducer: NavigationReducer.create(globals),
		taskReducer: TaskReducer.create(globals),
		// routing: routerReducer
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)

globals.store = store

// globals.history = syncHistoryWithStore(createHistory(), globals.store)






gapi.load('auth2', function () {
	gapi.auth2.init({
		client_id: Config.gApiKey
	}).then(onAuthSuccess, onAuthFailure);
})

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
		store.dispatch({ type: 'login', login })
		store.dispatch({ type: 'fetchTaskList' })
		store.dispatch({ type: 'redirect', position: 'taskList' })

		render()
		
	} else {
		auth.signIn({ ux_mode: 'redirect' });
		// leaving application for now, Google login screen is going to be displayed
	}
}

function onAuthFailure() {
	// TODO - Google auth init failed
}


function render(onFinish) {
	ReactDOM.render(
		<Provider store={store}>
			<Application />
		</Provider>,
		document.getElementById('app'),
		onFinish
	)
}