import React from 'react'

import Config from '../Config.jsx'
import ui from './Elements.jsx'
import DateInput from './DateInput.jsx'


/**
 * <DateControl name value className handleValueChange>
 * control that allows to select date
 */
 export default class DateControl extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: props.value,
			mode: props.mode
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value) {
			this.setState({ value: nextProps.value })
		}
		if (nextProps.mode) {
			this.setState({ mode: nextProps.mode })
		}
	}


	handleModeChangeToEdit() {
		this.setState({ mode: 'edit' })
	}

	handleModeChangeToView() {
		this.setState({ mode: 'view' })
	}

	handleValueChange(evt, data) {
		this.setState({ value: data.value })
		if (this.state.mode != 'create') {
			this.setState({ mode: 'view' })
		}
		this.props.handleValueChange(evt, { name: this.props.name, value: data.value })
	}

	rejectValueChange() {
		this.setState({ value: this.state.acceptedValue })
		if (this.state.mode != 'create') {
			this.setState({ mode: 'view' })
		}
	}

	render() {
		return (
			<div className="do--float do--control do--control--date">
				<ui.Show if={this.state.mode == 'view'}>
					<ui.DateView name={this.props.name} value={this.state.value} dateFormat={Config.DateControl.viewFormat} />
					<ui.Button
						label={Config.DateControl.messages.switchToEditMode}
						className="do--control__edit-button do--ui-button--small"
						onClick={this.handleModeChangeToEdit.bind(this)} />
				</ui.Show>
				<ui.Show if={ (this.state.mode == 'edit') || (this.state.mode == 'create') }>
					<div className="do--control__input do--float__left">
						<DateInput
							name={this.props.name}
							value={this.state.value}
							className="do--control__input-control" 
							dateFormat={Config.DateControl.viewFormat}

							handleValueChange={this.handleValueChange.bind(this)}
							handleClickOutside={this.rejectValueChange.bind(this)} />
					</div>
				</ui.Show>
				<ui.Show if={ (this.state.mode == 'edit') }>
					<div className="do--control__buttons do--float__left">
						<ui.Button label={Config.DateControl.messages.switchToViewMode} onClick={this.handleModeChangeToView.bind(this)} className='do--control__reject-button do--ui-button--small' />
					</div>
				</ui.Show>
			</div>
		)
	}
}