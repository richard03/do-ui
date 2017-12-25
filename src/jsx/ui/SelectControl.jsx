import React from 'react'

import Config from '../Config.jsx'
import ui from './Elements.jsx'
import SelectInput from './SelectInput.jsx'



/**
 * <TextControl name value className handleValueChange>
 * control that allows to edit text, accept or reject changes, and switch between create / edit / view modes
 */
export default class SelectControl extends React.Component {

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

	handleValueChange(evt, data) {
		this.setState({ value: data.value })
		if (this.state.mode != 'create') {
			this.setState({ mode: 'view' })
		}
		this.props.handleValueChange(evt, { name: this.props.name, value: data.value })	
	}

	rejectValueChange() {
		this.setState({ value: this.state.acceptedValue, mode: 'view' })
	}

	render() {
		return (
			<div className="do--float do--text-control">
				<ui.Show if={this.state.mode == 'view'}>
					<ui.SelectView value={this.state.value}>
						{this.props.children}
					</ui.SelectView>
					<ui.Button
						label={Config.SelectControl.messages.switchToEditMode}
						className="do--text-control__edit-button do--ui-button--small"
						onClick={this.handleModeChangeToEdit.bind(this)} />
				</ui.Show>
				<ui.Show if={ (this.state.mode == 'edit') || (this.state.mode == 'create') }>
					<div className="do--text-control__controls do--float__left">
						<SelectInput
								name={this.props.name}
								value={this.state.value}
								className="do--text-control__input-control" 

								handleValueChange={this.handleValueChange.bind(this)}>
							{this.props.children}

						</SelectInput>
					</div>
				</ui.Show>
			</div>
		)
	}
}