import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'moment'

import Config from './Config.jsx'
import ui from './uiElements.jsx'
import { getQueryVariable } from './lib.jsx'
import Header from './Header.jsx'



class Task extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			task : this.props.task
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ task: nextProps.task });

	}
	componentWillMount(nextProps, nextState) {
		this.props.updateSiteMapPosition(); // notify global sitemap that I am here
		if (this.props.login) {
			this.props.fetchTask();
		}
	}

	mode(newMode) {
		if (typeof newMode == 'string') { // set mode
			this.props.setMode(newMode);
		} else { // get current mode
			return this.props.mode
		}
	}

	handleFieldChange(evt) {
		let task = this.state.task;
		task[evt.target.name] = evt.target.value;
		this.setState({ task });
	}
	handleDeadlineChange(date) {
		let task = this.state.task;
		task.dueDate = date.format(Config.apiDateTimeFormat);
		this.setState({ task });
	}

	handleFormSubmit(evt) {
		evt.preventDefault();

		// task mapping
		let task = {
			id: this.state.task.id,
			title: this.state.task.title,
			acceptanceCriteria: this.state.task.acceptanceCriteria,
			dueDate: this.state.task.dueDate,
			status: this.state.task.status,
			priority: this.state.task.priority,
			owner: this.props.login
		}
		this.props.submitTask(task);
	}
	handleResolveTask() {
		// let task = this.state.task;
		// task.status = 'done';
		// this.setState({ task });
		this.props.resolveTask()
		this.props.history.push(Config.taskListScreenPath);


//		this.setMode('resolve');
	}
	handleDeleteTask() {
		// let task = this.state.task;
		// task.status = 'deleted';
		this.props.deleteTask()
		this.props.history.push(Config.taskListScreenPath);

	}

	handleFormFieldsClick() {
		if (this.mode() !== 'edit') {
			this.mode('edit');
		}
	}

	renderFormFields() {
		return (
			<div onClick={this.handleFormFieldsClick.bind(this)}>
				<input type="hidden" name="id" value={this.state.task.id} />
				<input type="hidden" name="status" value={this.state.task.status} />
			
			
				<ui.textField 
						mode={this.mode()}
						label='Název' 
						name='title' 
						value={this.state.task.title}
						handleValueChange={this.handleFieldChange.bind(this)}
						className='do--margin-medium--top' />

				<ui.selectField 
						mode={this.mode()}
						label='Priorita'
						name='priority' 
						value={this.state.task.priority}
						handleValueChange={this.handleFieldChange.bind(this)}
						className='do--margin-medium--top'
						options={[
							{value: 3, label: Config.messages.priority.critical},
							{value: 2, label: Config.messages.priority.high},
							{value: 1, label: Config.messages.priority.normal},
							{value: 0, label: Config.messages.priority.low}
						]}>
					<option value="3">{Config.messages.priority.critical}</option>
					<option value="2">{Config.messages.priority.high}</option>
					<option value="1">{Config.messages.priority.normal}</option>
					<option value="0">{Config.messages.priority.low}</option>
				</ui.selectField>

				<ui.dateField 
						mode={this.mode()}
						label='Termín' 
						value={this.state.task.dueDate}
						dateFormat={Config.taskDateFormat}
						handleValueChange={this.handleDeadlineChange.bind(this)} />

				<ui.textAreaField 
						mode={this.mode()}
						label='Akceptační kriteria' 
						name='acceptanceCriteria' 
						value={this.state.task.acceptanceCriteria}
						handleValueChange={this.handleFieldChange.bind(this)} />
			</div>
		);
	}

	renderFormButtons() {
		return (
			<div className="do--margin-extra--top do--float">
				<ui.show if={this.mode() == 'edit'}>
					<ui.submitButton label={Config.messages.saveChanges} className="do--margin-medium--right" />
					<ui.button label={Config.messages.back} className="do--margin-medium--right" onClick={this.mode.bind(this, 'view')} />			
				</ui.show>
				<ui.show if={this.mode() == 'create'}>
					<ui.submitButton label={Config.messages.createTask} className="do--margin-medium--right" />
					<Link to={Config.taskListScreenPath} className="do--button do--margin-medium--right">{Config.messages.back}</Link>		
				</ui.show>
				<ui.hide if={ (this.mode() == 'edit') || (this.state.mode == 'create')}>
					<ui.submitButton label={Config.messages.resolved} className="do--margin-medium--right" onClick={this.handleResolveTask.bind(this)} />
					<Link to={Config.taskListScreenPath} className="do--button do--margin-medium--right">{Config.messages.back}</Link>
					<ui.button label={Config.messages.delete} className="do--float__right" onClick={this.handleDeleteTask.bind(this)} />
				</ui.hide>
			</div>
		);
	}

	render() {

		if (!this.props.login) { // not logged in
			return (
				<div>
					<Header title={Config.messages.task} />
				</div>
			)
		}

		if (this.props.mode == 'submitting-new') {
			// if created, show list page
			this.props.history.push(Config.taskListScreenPath);
			return;
		}

		if (this.props.mode == 'submitting-resolve') {
			// if done, show list page
			this.props.history.push(Config.taskListScreenPath);
			return;
		}

		if ( (this.props.mode == 'view') || (this.props.mode == 'edit') ) {
			// show task detail
			return (
				<div>
					<Header title={Config.messages.task} />
					<form onSubmit={this.handleFormSubmit.bind(this)}>
						{this.renderFormFields()}
						{this.renderFormButtons()}
					</form>
				</div>
			)
		}

		return (
			<div>
				<Header title={Config.messages.task} />
				<div className="do--info do--margin-medium--top">{Config.messages.loadingData}</div>
			</div>
		)

	}
};

// export default Task


const mapStateToProps = (state) => {
	return {
		login: state.loginReducer.login,
		mode: state.taskReducer.mode,
		task: state.taskReducer.task
	};
};
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
export default connect(mapStateToProps, mapDispatchToProps)(Task);
