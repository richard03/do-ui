import React from 'react'
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom'

import Config from './Config.jsx'
import TaskList from './TaskList.jsx'
import Task from './Task.jsx'

// import { initAuth2, getAuth2 } from './lib.jsx'


class Dispatcher extends React.Component {

	constructor() {
		super();

		this.state = {
			loggedIn: false
		};

	}

	componentDidMount() {
		let dispatcherComponent = this;

		var auth2;
 		gapi.load('auth2', function () {
 			auth2 = gapi.auth2.init({
 				client_id: Config.gApiKey
 			});
 			// auth2.currentUser
 			// auth2.signIn
 			// auth2.signOut
 			// console.log(auth2);
 			// console.log(gapi.auth2);
 			auth2.attachClickHandler('auth2-login-button', {}, onSuccess, onFailure);
 		});

 		function onSuccess(user) {
 			dispatcherComponent.setState({ loggedIn: true });
		}

		function onFailure() {
 			console.log('failure');
 			// TODO: show message that login failed
 		}

 		var event = new Event('logout');
		window.addEventListener('logout', function () {
			auth2.signOut().then(function () {
				dispatcherComponent.setState({loggedIn: false});
			});
		})

	}

	render() {
		if (this.state.loggedIn) {
			return (
				<Router>
					<Switch>
						<Route exact path={Config.taskDetailScreenPath} component={Task}/>
						<Route component={TaskList}/>
					</Switch>
				</Router>
			);
		} else { // anonymous user
			return (
				<div>
					<h1 className="do--title">DO</h1>
					<button id="auth2-login-button">Sign in</button>
				</div>
			);
		}
	}
};

export default Dispatcher
