import React from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'

import Config from './Config.jsx'
import ui from './ui/Elements.jsx'
import lib from './lib.jsx'

import Header from './Header.jsx'
import TextControl from './ui/TextControl.jsx'
import DateControl from './ui/DateControl.jsx'
import SelectControl from './ui/SelectControl.jsx'
import CriteriaListControl from './ui/CriteriaListControl.jsx'


class Task extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			formMode: props.mode,
			newTaskData: null
		}
	}
	componentWillMount() {
	 	if (this.props.parameters && this.props.parameters.taskid) {
	 		const taskId = this.props.parameters.taskid
			this.props.fetchTask(taskId)
			this.setState({ formMode: 'view', newTask: null })
		} else {
			this.props.createTask()
			this.setState({ formMode: 'create', newTaskData: {} })
		}
	}

	handleValueChange(evt, data) {
		if (this.props.mode == 'read') {
			let task = Object.assign({}, this.props.task)
			task[ data.name ] = data.value
			this.props.updateTask(task)
			this.props.submitTask(task)
		} else if (this.props.mode == 'create') {
			let newTaskData = Object.assign({}, this.state.newTaskData)
			newTaskData[ data.name ] = data.value
			let component = this
			this.setState({ newTaskData }, function () {
				let task = Object.assign({}, this.props.task, this.state.newTaskData)
				this.props.updateTask(task)
			})
		}
		
	}

	/**
	 * Submits all changes to Redux
	 */
	handleSubmit() {
		if (this.props.mode == "create") {
			const newTask = Object.assign({}, this.props.task, this.state.newTaskData)
			this.props.submitTask(newTask)
			this.props.redirect('taskList')
		}
	}

	/**
	 * Tells Redux to mark this Task as resolved
	 */
	handleResolve() {
		this.props.resolveTask( this.props.task.id )
		this.props.redirect('taskList')
	}

	/**
	 * Tells Redux to delete this Task
	 */
	handleDelete() {
		this.props.deleteTask( this.props.task.id )
		this.props.redirect('taskList')
	}

	renderFormFields() {
		return (
			<div>

				<ui.Field label='Název'	className='do--margin-medium--top'>
					<TextControl
							mode={this.state.formMode}	
							name='title'
							value={this.props.task.title}

							handleValueChange={this.handleValueChange.bind(this)} />
				</ui.Field>
				
				<ui.Field label='Termín'>
					<DateControl
							mode={this.state.formMode}
							name='dueDate'
							value={this.props.task.dueDate}
							dateFormat={Config.taskDateFormat}
							handleValueChange={this.handleValueChange.bind(this)} />
				</ui.Field>

				<ui.Field label='Priorita'>
					<SelectControl
							mode={this.state.formMode}
							name='priority'
							value={this.props.task.priority}

							handleValueChange={this.handleValueChange.bind(this)}>
						<option value="3">{Config.messages.priority.critical}</option>
						<option value="2">{Config.messages.priority.high}</option>
						<option value="1">{Config.messages.priority.normal}</option>
						<option value="0">{Config.messages.priority.low}</option>
					</SelectControl>
				</ui.Field>
				
				<ui.Field label='Akceptační kriteria'>
					<CriteriaListControl
							mode={this.state.formMode}
							name='acceptanceCriteria'
							value={this.props.task.acceptanceCriteria}

							handleValueChange={this.handleValueChange.bind(this)} />
				</ui.Field>

				<ui.Field label='Je zadání kompletní?'>

					<SelectControl
							mode={this.state.formMode}
							name='status'
							value={this.props.task.status}

							handleValueChange={this.handleValueChange.bind(this)}>
						<option value="open">{Config.messages.status.open.option}</option>
						<option value="incomplete">{Config.messages.status.incomplete.option}</option>
						<option value="incomprehensible">{Config.messages.status.incomprehensible.option}</option>
						<option value="oversized">{Config.messages.status.oversized.option}</option>
					</SelectControl>

				</ui.Field>
			</div>
		);
	}

	renderFormButtons() {
		return (
			<div className="do--margin-extra--top do--float">
				<ui.Show if={ (this.props.mode == 'read') || (this.props.mode == 'submittingUpdate') }>
					<ui.Button label={Config.messages.resolved} className="do--margin-medium--right" onClick={this.handleResolve.bind(this)} />
					<ui.Button label={Config.messages.back} className="do--margin-medium--right" onClick={this.props.redirect.bind(this, 'taskList')} />
					<ui.Button label={Config.messages.delete} className="do--float__right" onClick={this.handleDelete.bind(this)} />
				</ui.Show>
				<ui.Show if={this.props.mode == 'create'}>
					<ui.Button label={Config.messages.createTask} className="do--margin-medium--right" onClick={this.handleSubmit.bind(this)} />
					<ui.Button label={Config.messages.back} className="do--margin-medium--right" onClick={this.props.redirect.bind(this, 'taskList')} />
				</ui.Show>
			</div>
		);
	}

	render() {

		if (this.props.mode == 'submitting-new') {
			// if created, show list page
			this.redirectToTaskList()
			return
		}

		if (this.props.mode == 'submitting-resolve') {
			// if done, show list page
			this.redirectToTaskList()
			return
		}

		if ( (this.props.mode == 'read') || (this.props.mode == 'create') || (this.props.mode == 'submittingUpdate') ) {
			// show task detail
			return (
				<div className="do--box">
					<Header title={Config.messages.task} />
					<form>
						{ this.renderFormFields() }
						{ this.renderFormButtons() }
					</form>
				</div>
			)
		}

		return (
			<div className="do--box">
				<Header title={Config.messages.task} />
				<div className="do--info do--margin-medium--top">{Config.messages.loadingData}</div>
			</div>
		)

	}
};

const mapStateToProps = (state) => {
	return {
		parameters: state.navigationReducer.parameters,
		mode: state.taskReducer.mode,
		task: state.taskReducer.task
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		redirect: (position) => dispatch({ type: 'redirect', position }),
		setMode: (newMode) => dispatch({ type: 'setTaskFormMode', newMode }),
		fetchTask: (taskId) => dispatch({ type: 'fetchTask', taskId }),
		createTask: () => dispatch({ type: 'createTask' }),
		updateTask: (task) => dispatch({ type: 'updateTask', task}),
		submitTask: (task) => dispatch({ type: 'submitTask', task }),
		resolveTask: (taskId) => dispatch({ type: 'resolveTask', taskId }),
		deleteTask: (taskId) => dispatch({ type: 'deleteTask', taskId })
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Task)
