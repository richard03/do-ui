import React from 'react'
import { connect } from 'react-redux'

import Config from './Config.jsx'
import lib from './lib.jsx'
import ui from './ui/Elements.jsx'

import Header from './Header.jsx'
import TaskListItems from './TaskListItems.jsx'



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

	render() {
		if (this.props.loading) {
			return ( // loading...
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
					<TaskListItems tasks={this.props.tasks} editTaskRedirect={this.props.redirect.bind(this)} />
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
