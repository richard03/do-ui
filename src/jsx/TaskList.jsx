import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Config from './Config.jsx'
import { addClassName } from './lib.jsx'
import Header from './Header.jsx'

class TaskList extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.props.loadTaskList()
	}

	resolveTaskHandler(evt) {
		let listItemElm = evt.target.parentNode
		addClassName(listItemElm, 'do--list__item--removed')
		let taskId = listItemElm.dataset.taskId
		this.props.resolveTask(taskId)
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

		var taskListHtml, taskListItemsHtml;
		taskListHtml = <div className="do--info do--margin-medium--top">{Config.messages.emptyTaskList}</div>
		if (this.props.tasks.length > 0) {
			taskListItemsHtml = this.props.tasks.map((taskData)=>
				(taskData.status === 'open')? 
					<li className={getTaskListItemClass(taskData)} key={taskData.id} data-task-id={taskData.id}>
						<Link to={Config.taskDetailScreenPath + '?taskid=' + taskData.id} className="do--list__item__link do--margin-wide--left">{taskData.title}</Link>
						<button className="do--list__button-left" onClick={this.resolveTaskHandler.bind(this)}> </button>
					</li>
				: ''
			);
			taskListHtml = <ul className="do--list do--margin-medium--top">{taskListItemsHtml}</ul>
		}
		return taskListHtml
	}

	render() {
		if (this.props.login) {
			if (this.props.loading) {
				return (
					<div>
						<Header title={Config.messages.tasks} />
						<div>{Config.messages.loadingTaskList}</div>
					</div>
				)
			} else { // taskList already loaded
				return (
					<div>
						<Header title={Config.messages.tasks} />
						<Link to={Config.taskDetailScreenPath} className="do--button do--margin-medium--top">{Config.messages.addTask}</Link>
						{this.getTaskListHtml()}
					</div>
				)
			}
		} else { // not logged in
			return (
				<Header title={Config.messages.tasks} />
			)
		}
	}
};


const mapStateToProps = (state) => {
	return {
		login: state.loginReducer.login,
		loading: state.taskReducer.taskListLoading,
		tasks: state.taskReducer.tasks
    };
};
const mapDispatchToProps = (dispatch) => {
	return {
		loadTaskList: () => dispatch({ type: "loadTaskList" }),
		resolveTask: (taskId) => dispatch({ type: "resolveTask", taskId })
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
