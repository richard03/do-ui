import React from 'react'
import Textarea from 'react-textarea-autosize'

import Config from '../Config.jsx'
import ui from './Elements.jsx'
import CheckListInput from './CheckListInput.jsx'
import TextListInput from './TextListInput.jsx'



export default class CriteriaListControl extends React.Component {
	constructor(props) {
		super(props)

		// input data transformation
		let criteriaList = props.value.map( (item) => ({
			checked: item.passed,
			description: item.description
		}) )
		this.state = {
			value: criteriaList,
			acceptedValue: criteriaList,
			mode: props.mode
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value) {
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
		if (this.state.mode == 'edit') {
			this.setState({ value: data.value })
		} else {
			this.setState({ value: data.value }, function () {
				this.acceptValueChange(evt)
			})
		} 
	}

	acceptValueChange(evt) {
		this.setState({ acceptedValue: this.state.value, mode: 'view' })

		// output data transformation
		let value = this.state.value.map( (item) => ({
			passed: item.checked,
			description: item.description
		}) )
		this.setState({ value: this.state.value })
		this.props.handleValueChange(evt, { name: this.props.name, value: value })
	}

	rejectValueChange() {
		this.setState({ value: this.state.acceptedValue, mode: 'view' })
	}

	render() {
		return (
			<div className="do--float do--control do--control--criteria-list">

				<ui.Show if={this.state.mode == 'view'}>

					<CheckListInput
							name={this.props.name} 
							value={this.state.value} 

							handleValueChange={this.handleValueChange.bind(this)} />
				
					<ui.Button
						label={Config.CriteriaListControl.messages.switchToEditMode}
						className="do--control__edit-button do--ui-button--small"
						onClick={this.handleModeChangeToEdit.bind(this)} />

				</ui.Show>

				<ui.Show if={ (this.state.mode == 'edit') || (this.state.mode == 'create') }>
					<div className="do--control__input do--float__left">
						<TextListInput
								name={this.props.name}
								value={this.state.value}

								handleValueChange={this.handleValueChange.bind(this)} />

					</div>
				</ui.Show>
				<ui.Show if={this.state.mode == 'edit'}>
					<div className="do--control__buttons do--float__left">
						<ui.Button label={Config.CriteriaListControl.messages.acceptValue} onClick={this.acceptValueChange.bind(this)} className='do--control__accept-button do--ui-button--small' />
						<ui.Button label={Config.CriteriaListControl.messages.rejectValue} onClick={this.rejectValueChange.bind(this)} className='do--control__reject-button do--ui-button--small' />
					</div>
				</ui.Show>
			</div>
		)
	}
}

