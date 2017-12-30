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
						<ui.Button label={Config.messages.addTask} className="do--ui-button do--margin-medium--top" onClick={this.props.createTask} />
					</div>
					<TaskListItems tasks={this.props.tasks} exclude={ { status: ['done'] } } taskDetailHandler={this.props.fetchTask} />
				</div>
			)
		}
	}
}


const mapStateToProps = (state) => {
	return {
		loading: state.taskReducer.taskListLoading,
		tasks: state.taskReducer.tasks
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		createTask: () => dispatch({ type: "createTask" }),
		fetchTask: (taskId) => dispatch({ type: "fetchTask", taskId })
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
