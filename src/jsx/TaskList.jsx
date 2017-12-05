import React from 'react'
import { Link } from 'react-router-dom'

import Config from './Config.jsx'
import { addClassName } from './lib.jsx'


class TaskList extends React.Component {

	constructor() {
		super();

		this.state = {
			tasks: [],
			listLoaded: null
		};

	}

	loadTaskList() {
		fetch(Config.apiBaseUrl + Config.apiTaskListPath)
			.then(result=>result.json())
			.then(tasks=>this.setState({tasks: tasks, listLoaded: true}));
	}

	componentDidMount() {
		this.loadTaskList();

		var event = new Event('logout');
		document.getElementById('auth2-logout-button').addEventListener('click', function () {
console.log('logging out');
			this.dispatchEvent(event);
		});

	}

	taskDoneHandler(evt) {
		const taskId = evt.target.getAttribute('data-task-id');
		let taskListComponent = this;
		addClassName(evt.target.parentNode, 'do--list__item--removed');

		let postBody = new FormData();
		postBody.set('id', taskId);
		postBody.set('status', "done");
		fetch(Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/', { 
			method: 'POST',
			body: postBody
		}).then(taskListComponent.loadTaskList());
	}


	getTaskListHtml() {

		function getTaskListItemClass(taskData) {
			let buffer = [];
			buffer.push("do--list__item");
			buffer.push("do--list__item--no-padding");
			switch("" + taskData.priority) {
				case "0": buffer.push("do-list__item--low-priority"); break;
				case "1": buffer.push("do-list__item--normal-priority"); break;
				case "2": buffer.push("do-list__item--high-priority"); break;
				case "3": buffer.push("do-list__item--critical-priority"); break;
			}
			return buffer.join(" ");
		}

		var taskListHtml;
		if (!this.state.listLoaded) {
			taskListHtml = <div className="do--info do--margin-medium--top">{Config.loadingListMessage}</div>
			
		} else {
			var taskListItemsHtml;
			taskListHtml = <div className="do--info do--margin-medium--top">{Config.emptyListMessage}</div>
			if (this.state.tasks.length > 0) {
				taskListItemsHtml = this.state.tasks.map((taskData)=>
					(taskData.status === 'open')? 
						<li className={getTaskListItemClass(taskData)} key={taskData.id}>
							<Link to={Config.taskDetailScreenPath + '?taskid=' + taskData.id} className="do--list__item__link do--margin-wide--left">{taskData.title}</Link>
							<button className="do--list__button-left" data-task-id={taskData.id} onClick={this.taskDoneHandler.bind(this)}> </button>
						</li>
					: ''
				);
				taskListHtml = <ul className="do--list do--margin-medium--top">{taskListItemsHtml}</ul>
			}
		}
		return taskListHtml
	}

	render() {
		// let auth2 = gapi.auth2.getAuthInstance();
		// if (auth2.isSignedIn.get()) {
			return (
				<div>
					<button id="auth2-logout-button">Log out</button>
					<button onClick={logUser}>User data</button>

					<h1 className="do--title">Úkoly</h1>
					<Link to={Config.taskDetailScreenPath} className="do--button do--margin-medium--top">Přidat úkol</Link>
					{this.getTaskListHtml()}
				</div>
			);
		// } else {
		// 	auth2.signIn();
		// 	return ;
		// }
	}
};

// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

// function signOut() {
// 	var auth2 = gapi.auth2.getAuthInstance();
// 	auth2.signOut().then(function () {
// 	  console.log('User signed out.');
// 	});
// }

function logUser() {
	var auth2 = gapi.auth2.getAuthInstance();
	if (auth2.isSignedIn.get()) {
	  var profile = auth2.currentUser.get().getBasicProfile();
	  console.log('ID: ' + profile.getId());
	  console.log('Full Name: ' + profile.getName());
	  console.log('Given Name: ' + profile.getGivenName());
	  console.log('Family Name: ' + profile.getFamilyName());
	  console.log('Image URL: ' + profile.getImageUrl());
	  console.log('Email: ' + profile.getEmail());
	}
}

export default TaskList
