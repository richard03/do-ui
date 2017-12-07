import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'moment'

import Config from './Config.jsx'
import { getQueryVariable } from './lib.jsx'
import ui from './uiElements.jsx'
import Header from './Header.jsx'


class Task extends React.Component {
	constructor(props) {
		super(props);

		const maxId = 9999999999999999; // may not be bigger than maxBigInt and maxLong (for compatibility with other systems we integrate)

		const newTaskId = Math.floor(Math.random() * maxId); // id for new task. If we load a task later in component lifecycle, this will be overwritten

		this.state = {
			task: {
				id: newTaskId,
				status: 'open',
				title: '',
				dueDate: Moment().format(Config.apiDateTimeFormat),
				acceptanceCriteria: '',
				priority: 1
			},
			mode: 'initializing'
		};
	}

	componentDidMount() {
		const taskId = getQueryVariable('taskid');
		if (taskId) {
			const taskComponent = this;
		
			this.fetchFromApi(taskId)
				.then(function () {
					taskComponent.setMode('view');
				});
		} else {
			this.setMode('create');
		}
	}

	setMode(newMode) {
		this.setState({ mode: newMode });
	}

	getApiUrl(taskId) {
		if (taskId) {
			return Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/'
		} else {
			return Config.apiBaseUrl + Config.apiTaskListPath + '/' + this.state.task.id + '/'
		}
	}

	fetchFromApi(taskId) {
		const taskComponent = this;
		return new Promise((resolve) => {
			fetch(taskComponent.getApiUrl(taskId))
				.then(result=>result.json())
				.then((taskData) => {
					// task mapping
					let task = {};
					task.id = taskData['id'];
					task.title = taskData['title'];
					task.acceptanceCriteria = taskData['acceptance_criteria'];
					task.dueDate = taskData['due_date'];
					task.status = taskData['status'];
					task.priority = taskData['priority'];
					// end task mapping
					taskComponent.setState({ task: task });
					resolve();
				});
		});
	}

	submitToApi() {
 		let postBody = new FormData();
 		// task mapping
		postBody.set('id', this.state.task.id);
		postBody.set('title', this.state.task.title);
		postBody.set('acceptance_criteria', this.state.task.acceptanceCriteria);
		postBody.set('due_date', this.state.task.dueDate);
		postBody.set('status', this.state.task.status);
		postBody.set('priority', this.state.task.priority);

		const taskComponent = this;
		return new Promise((resolve) => {
			fetch(taskComponent.getApiUrl(), {
				method: 'POST',
				body: postBody
			}).then(function () {
				resolve();
			});
		});
	}

	setStatusDone() {
		let task = this.state.task;
		task.status = 'done';
		this.setState({
			task: task
		});
	}
	handleFieldChange(evt) {
		let task = this.state.task;
		task[evt.target.name] = evt.target.value;
		this.setState({
			task: task
		});
	}
	handleDeadlineChange(date) {
		let task = this.state.task;
		task.dueDate = date.format(Config.apiDateTimeFormat);
		this.setState({
			task: task
		});
	}
	handleFormSubmit(evt) {
		evt.preventDefault();

		const formerMode = this.state.mode;
		this.setMode('view'); // prevent more interactions

		const taskComponent = this;
		this.submitToApi().then(function () {
			if ( (formerMode === 'create') || (taskComponent.state.task.status === "done")) {
				taskComponent.props.history.push(Config.taskListScreenPath);
			}
		});
	}
	deleteTask(evt) {
		evt.preventDefault();
		const taskComponent = this;
		fetch(this.getApiUrl(), {
			method: 'DELETE'
		}).then(function () {
			taskComponent.props.history.push(Config.taskListScreenPath);
		});
	}

	render() {
		if (this.state.mode == 'initializing') {
			return (
				<div>
					<Header title='Úkol' store={this.props.store} />
					<div className="do--info do--margin-medium--top">{Config.loadingDataMessage}</div>
				</div>
			)
		} else {
			return (
				<div>
					<Header title='Úkol' />
					<form method="POST" action={this.getApiUrl()} onSubmit={this.handleFormSubmit.bind(this)}>
						<input type="hidden" name="id" value={this.state.task.id}/>
						<input type="hidden" name="status" value={this.state.task.status}/>

						<ui.textField 
								mode={this.state.mode}
								label='Název' 
								name='title' 
								value={this.state.task.title}
								onClick={this.setMode.bind(this, 'edit')}
								onValueChange={this.handleFieldChange.bind(this)}
								className='do--margin-medium--top' />

						<ui.selectField 
								mode={this.state.mode}
								label='Priorita'
								name='priority' 
								value={this.state.task.priority}
								onClick={this.setMode.bind(this, 'edit')}
								onValueChange={this.handleFieldChange.bind(this)}
								className='do--margin-medium--top'
								options={[
									{value: 3, label: "Kritická"},
									{value: 2, label: "Vysoká"},
									{value: 1, label: "Normální"},
									{value: 0, label: "Nízká"}
								]}>
							<option value="3">Kritická</option>
							<option value="2">Vysoká</option>
							<option value="1">Normální</option>
							<option value="0">Nízká</option>
						</ui.selectField>

						<ui.dateField 
								mode={this.state.mode}
								label='Termín' 
								value={this.state.task.dueDate}
								dateFormat={Config.taskDateFormat}
								onClick={this.setMode.bind(this, 'edit')}
								onValueChange={this.handleDeadlineChange.bind(this)} />

						<ui.textAreaField 
								mode={this.state.mode}
								label='Akceptační kriteria' 
								name='acceptanceCriteria' 
								value={this.state.task.acceptanceCriteria}
								onClick={this.setMode.bind(this, 'edit')}
								onValueChange={this.handleFieldChange.bind(this)} />

						<div className="do--margin-extra--top">
							<ui.show if={this.state.mode == 'view'}>
								<ui.submitButton label='Splněno' className="do--margin-medium--right" onClick={this.setStatusDone.bind(this)} />
								<Link to={Config.taskListScreenPath} className="do--button do--margin-medium--right">Zpět</Link>
								<ui.button label='Smazat' className="do--float--right" onClick={this.deleteTask.bind(this)} />
							</ui.show>
							<ui.show if={this.state.mode == 'edit'}>
								<ui.submitButton label='Uložit změny' className="do--margin-medium--right" />
								<ui.button label='Zpět' className="do--margin-medium--right" onClick={this.setMode.bind(this, 'view')} />			
							</ui.show>
							<ui.show if={this.state.mode == 'create'}>
								<ui.submitButton label='Vytvořit úkol' className="do--margin-medium--right" />
								<Link to={Config.taskListScreenPath} className="do--button do--margin-medium--right">Zpět</Link>		
							</ui.show>
						</div>

					</form>
				</div>
			);
		}
	}
};

export default Task