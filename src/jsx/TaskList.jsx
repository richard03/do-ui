import React from 'react'
import { connect } from 'react-redux'

import Config from './Config.jsx'
import { addClassName } from './lib.jsx'
import ui from './ui/Elements.jsx'

import Header from './Header.jsx'



class TaskList extends React.Component {

	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.loadTaskList()
	}

	handleAddTask() {
		this.props.redirect('task')
	}

	handleEditTask(evt) {
		const taskId = evt.target.dataset.taskId
		this.props.redirect('task', { taskid: taskId })
//		this.props.history.push(Config.taskDetailScreenPath + '?taskid=' + taskId)
	}

	resolveTaskHandler(evt) {
		let listItemElm = evt.target.parentNode
		addClassName(listItemElm, 'do--list__item--removed')
		let taskId = listItemElm.dataset.taskId
		this.props.resolveTask(taskId)
	}

	getTaskListHtml() {
		function getTaskListItemClass(taskData) {
			let buffer = []
			buffer.push("do--list__item")
			buffer.push("do--list__link")
			switch("" + taskData.priority) {
				case "0": buffer.push("do-list__item--low-priority"); break;
				case "1": buffer.push("do-list__item--normal-priority"); break;
				case "2": buffer.push("do-list__item--high-priority"); break;
				case "3": buffer.push("do-list__item--critical-priority"); break;
			}
			return buffer.join(" ")
		}

		var taskListHtml, taskListItemsHtml;
		taskListHtml = <div className="do--info do--margin-medium--top">{Config.messages.emptyTaskList}</div>
		if (this.props.tasks.length > 0) {
			taskListItemsHtml = this.props.tasks.map((taskData)=>
				(taskData.status == 'done') ? '' : 
					<li className={getTaskListItemClass(taskData)} key={taskData.id} data-task-id={taskData.id} onClick={this.handleEditTask.bind(this)}>
						{taskData.title}
					</li>
			)
			taskListHtml = <ul className="do--list do--margin-medium--top">{taskListItemsHtml}</ul>
		}
		return taskListHtml
	}

	render() {
		if (this.props.loading) {
			return (
				<div className="do--box">
					<Header title={Config.messages.tasks} />
					<div>{Config.messages.loadingTaskList}</div>
				</div>
			)
		} else { // taskList already loaded
			return (
				<div className="do--box">
					<Header title={Config.messages.tasks} />
					<div>
						<ui.Button label={Config.messages.addTask} className="do--ui-button do--margin-medium--top" onClick={this.handleAddTask.bind(this)} />
					</div>
					{this.getTaskListHtml()}
				</div>
			)
		}
	}
}


const mapStateToProps = (state) => {
	return {
		loading: state.taskListReducer.taskListLoading,
		tasks: state.taskListReducer.tasks
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		redirect: (position, parameters) => dispatch({ type: 'redirect', position, parameters }),
		loadTaskList: () => dispatch({ type: "loadTaskList" }),
		resolveTask: (taskId) => dispatch({ type: "resolveTask", taskId })
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
