import React from 'react'
import Textarea from 'react-textarea-autosize'

import Config from './Config.jsx'
import ui from './uiElements.jsx'


class CriteriaList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: props.value,
			mode: props.mode
		}
	}

	changeValue(newValue) {
		this.setState({ value: newValue })
		// send false event up
		this.props.handleValueChange({
			target: {
				name: this.props.name,
				value: this.state.value
			}
		});
	}
	switchToEditMode() {
		this.setState({ mode: 'edit' });
	}
	switchToViewMode() {
		this.setState({ mode: 'view' });
	}	
	handleListItemCheck(evt) {
		evt.stopPropagation();

		const checkbox = evt.target
		const listItem = evt.target.parentNode.parentNode
		const index = parseInt(listItem.dataset.index, 10)
		
		let newValue = this.state.value;
		newValue[index].passed = evt.target.checked
		this.changeValue(newValue)
	}
	handleItemChange(evt) {
		const field = evt.target
		const listItem = evt.target.parentNode
		const index = parseInt(listItem.dataset.index, 10)

		let newValue = this.state.value
		newValue[index].description = evt.target.value
		this.changeValue(newValue)
	}
	handleItemAdd(evt) {
		let newValue = this.state.value
		newValue.push( { checked: false, description: '' })
		this.changeValue(newValue)
	}
	handleItemDelete(evt) {
		const listItem = evt.target.parentNode
		const index = parseInt(listItem.dataset.index, 10)
		let newValue = this.state.value
		newValue.splice(index, 1)
		this.changeValue(newValue)
	}

	render() {
		const component = this;

		const className = 'do--data-field do--criteria-list ' + component.props.className

		switch (component.state.mode) {
			case 'create':
			case 'edit':
				return (
					<div className={className} data-name={component.props.name}>
						<ui.fieldLabel text={component.props.label} mode={component.state.mode} />
						{component.state.value.map( function (item, i) {
							return (
		 						<div className="do--criteria-list__item" key={i.toString()} data-index={i.toString()}>
									<Textarea
										minRows={1}
										name={component.props.name}
										value={component.state.value[i].description}
										onChange={component.handleItemChange.bind(component)}
										className="do--data-field__control do--data-field__control--wide" />
									<ui.button label="x" onClick={component.handleItemDelete.bind(component)} className="do--criteria-list__delete-button do--button--small" />
		 						</div>
		 					)
						} )}
						<ui.button label={Config.messages.addNext} className="do--criteria-list__add-button do--button--small" onClick={component.handleItemAdd.bind(component)} />
						<ui.button label={Config.messages.switchToViewMode} className="do--criteria-list__view-button do--button--small" onClick={component.switchToViewMode.bind(component)} />
					</div>
		 		)
		 	default: // in view mode
				return (
					<div className={className}>
						<ui.fieldLabel text={component.props.label} mode={component.state.mode} />
						{component.state.value.map( function (item, i) {
							return (
								<div className="do--criteria-list__item" key={i.toString()} data-index={i.toString()}>
									<label><input
										type="checkbox"
										name={component.props.name}
										checked={item.passed}
										onChange={component.handleListItemCheck.bind(component)}
										/> {item.description}</label>
									<input type="hidden" name={component.props.name} value={component.state.value[i].description} />
								</div>
							)
						} )}
						<ui.button label={Config.messages.switchToEditMode} className="do--criteria-list__edit-button do--button--small" onClick={component.switchToEditMode.bind(component)} />
					</div>
				)
		 }
	}
}

export default CriteriaList
