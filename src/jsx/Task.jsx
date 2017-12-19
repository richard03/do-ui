import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'moment'

import Config from './Config.jsx'
import ui from './uiElements.jsx'
import { getQueryVariable } from './lib.jsx'

import Header from './Header.jsx'
import Field from './Field.jsx'
import CriteriaList from './CriteriaList.jsx'



class Task extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			task: this.props.task
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ task: nextProps.task })

	}
	componentWillMount(nextProps, nextState) {
		this.props.updateSiteMapPosition() // notify global sitemap that I am here
		this.props.fetchTask()
	}

	mode(newMode) {
		if (typeof newMode == 'string') { // set mode
			this.props.setMode(newMode)
		} else { // get current mode
			return this.props.mode
		}
	}

	redirectToTaskList() {
		this.props.history.push(Config.taskListScreenPath)
	}

	handleFieldChange(evt, name, value) {
		let task = this.state.task
		task[name] = value
		this.setState({ task })
	}
	handleFormSubmit(evt) {
		evt.preventDefault()

		// task mapping
		let task = {
			id: this.state.task.id,
			title: this.state.task.title,
			acceptanceCriteria: this.state.task.acceptanceCriteria,
			dueDate: this.state.task.dueDate,
			status: this.state.task.status,
			priority: this.state.task.priority
		}
		this.props.submitTask(task)
		if (this.props.mode == "create") {
			this.redirectToTaskList()
		}
	}
	handleResolveTask() {
		this.props.resolveTask()
		this.redirectToTaskList()
	}
	handleDeleteTask() {
		this.props.deleteTask()
		this.redirectToTaskList()
	}

	renderFormFields() {
		return (
			<div>
				<input type="hidden" name="id" value={this.state.task.id} />
				<input type="hidden" name="status" value={this.state.task.status} />

				<Field type='text'
						mode={this.mode()}
						label='Název'
						name='title'
						value={this.state.task.title}
						handleValueChange={this.handleFieldChange.bind(this)}
						className='do--margin-medium--top' />

				<Field type='date'
						mode={this.mode()}
						label='Termín'
						name='dueDate'
						value={this.state.task.dueDate}
						dateFormat={Config.taskDateFormat}
						handleValueChange={this.handleFieldChange.bind(this)} />

				<Field type='select'
						mode={this.mode()}
						label='Priorita'
						name='priority'
						value={this.state.task.priority}
						handleValueChange={this.handleFieldChange.bind(this)}>
					<option value="3">{Config.messages.priority.critical}</option>
					<option value="2">{Config.messages.priority.high}</option>
					<option value="1">{Config.messages.priority.normal}</option>
					<option value="0">{Config.messages.priority.low}</option>
				</Field>

			</div>
		);
	}

	renderFormButtons() {
		return (
			<div className="do--margin-extra--top do--float">
				<ui.Show if={this.mode() == 'edit'}>
					<ui.SubmitButton label={Config.messages.saveChanges} className="do--margin-medium--right" />
					<ui.Button label={Config.messages.back} className="do--margin-medium--right" onClick={this.mode.bind(this, 'view')} />
				</ui.Show>
				<ui.Show if={this.mode() == 'create'}>
					<ui.SubmitButton label={Config.messages.createTask} className="do--margin-medium--right" />
					<Link to={Config.taskListScreenPath} className="do--button do--margin-medium--right">{Config.messages.back}</Link>
				</ui.Show>
				<ui.Hide if={ (this.mode() == 'edit') || (this.mode() == 'create') }>
					<ui.SubmitButton label={Config.messages.resolved} className="do--margin-medium--right" onClick={this.handleResolveTask.bind(this)} />
					<Link to={Config.taskListScreenPath} className="do--button do--margin-medium--right">{Config.messages.back}</Link>
					<ui.Button label={Config.messages.delete} className="do--float__right" onClick={this.handleDeleteTask.bind(this)} />
				</ui.Hide>
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

		if ( (this.props.mode == 'view') || (this.props.mode == 'edit') || (this.props.mode == 'create') ) {
			// show task detail
			return (
				<div className="do--box">
					<Header title={Config.messages.task} />
					<form onSubmit={this.handleFormSubmit.bind(this)}>
						{this.renderFormFields()}
						{this.renderFormButtons()}
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
		mode: state.taskReducer.mode,
		task: state.taskReducer.task
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		updateSiteMapPosition: () => dispatch({ type: 'setSiteMapPosition', newPosition: 'task' }),
		setMode: (newMode) => dispatch({ type: 'setTaskFormMode', newMode }),
		fetchTask: () => dispatch({ type: 'fetchTask' }),
		submitTask: (task) => dispatch({ type: 'submitTask', task }),
		resolveTask: () => dispatch({ type: 'resolveTask' }),
		deleteTask: () => dispatch({ type: 'deleteTask' })
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Task)
