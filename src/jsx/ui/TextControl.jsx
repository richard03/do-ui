import React from 'react'

import Config from '../Config.jsx'
import ui from './Elements.jsx'
import TextInput from './TextInput.jsx'



/**
 * <TextControl name value className handleValueChange>
 * control that allows to edit text, accept or reject changes, and switch between create / edit / view modes
 */
export default class TextControl extends React.Component {

	constructor(props) {
	super(props)
	this.state = {
			value: props.value,
			acceptedValue: props.value,
			mode: props.mode
		}
	}

	componentWillReceiveProps(nextProps) {
		if (typeof nextProps.value == 'string') {
			this.setState({ value: nextProps.value, acceptedValue: nextProps.value })
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
		if (this.state.mode == 'create') {
			this.props.handleValueChange(evt, { name: this.props.name, value: data.value })
		}
	}

	acceptValueChange(evt) {
		this.setState({ acceptedValue: this.state.value, mode: 'view' })
		this.props.handleValueChange(evt, { name: this.props.name, value: this.state.value })
	}

	rejectValueChange() {
		this.setState({ value: this.state.acceptedValue, mode: 'view' })
	}

	render() {
		return (
			<div className="do--float do--control do--control--text">
				<ui.Show if={this.state.mode == 'view'}>
					<ui.TextView value={this.state.value} />
					<ui.Button
						label={Config.TextControl.messages.switchToEditMode}
						className="do--control__edit-button do--ui-button--small"
						onClick={this.handleModeChangeToEdit.bind(this)} />
				</ui.Show>
				<ui.Show if={ (this.state.mode == 'edit') || (this.state.mode == 'create') }>
					<div className="do--control__input do--float__left">
						<TextInput
							name={this.props.name}
							value={this.state.value}

							handleValueChange={this.handleValueChange.bind(this)} />

					</div>
				</ui.Show>
				<ui.Show if={this.state.mode == 'edit'}>
					<div className="do--control__buttons do--float__left">
						<ui.Button label={Config.TextControl.messages.acceptValue} onClick={this.acceptValueChange.bind(this)} className='do--text-control__accept-button do--ui-button--small' />
						<ui.Button label={Config.TextControl.messages.rejectValue} onClick={this.rejectValueChange.bind(this)} className='do--text-control__reject-button do--ui-button--small' />
					</div>
				</ui.Show>
			</div>
		)
	}
}