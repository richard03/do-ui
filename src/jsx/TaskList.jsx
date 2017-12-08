import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Config from './Config.jsx'
import { addClassName } from './lib.jsx'
import Header from './Header.jsx'

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

		// var event = new Event('logout');
		// document.getElementById('auth2-logout-button').addEventListener('click', function () {
		// 	this.dispatchEvent(event);
		// });

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
		return (
			<div>
				<Header title='Úkoly' />
				<Link to={Config.taskDetailScreenPath} className="do--button do--margin-medium--top">Přidat úkol</Link>
				{this.getTaskListHtml()}
			</div>
		);
	}
};


// export default TaskList

const mapStateToProps = (state) => {
    return {
        name: state.name,
        // hasErrored: state.itemsHasErrored,
        // isLoading: state.itemsIsLoading
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
//        fetchData: (url) => dispatch(itemsFetchData(url))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
