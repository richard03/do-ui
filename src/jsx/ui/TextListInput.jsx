import React from 'react'
import Textarea from 'react-textarea-autosize'

import Config from '../Config.jsx'
import ui from './Elements.jsx'



/**
 * <TextListInput name value className handleValueChange>
 *
 * a list of text values, that allows to edit / add / remove values
 */
export default class TextListInput extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: props.value, // list of items
			newItemDescription: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value) {
			this.setState({ value: nextProps.value })
		}
	}

	changeValue(evt, newValue) {
		this.setState({ value: newValue })
		if (typeof this.props.handleValueChange == 'function') {
			this.props.handleValueChange(evt, { name: this.props.name, value: newValue })
		}
	}

	handleItemChange(evt) {
		const field = evt.target
		const listItem = evt.target.parentNode
		const index = parseInt(listItem.dataset.index, 10)

		let value = Array.from(this.state.value)
		value[index].description = evt.target.value
		this.changeValue(evt, value)
	}

	handleNewItemChange(evt) {
		this.setState({ newItemDescription: evt.target.value })
	}

	handleItemAdd(evt) {
		let newValue = Array.from(this.state.value)
		let newItem = { checked: false, description: this.state.newItemDescription }
		newValue.push(newItem)
		this.setState({ newItemDescription: '' })
		this.changeValue(evt, newValue)
	}

	handleItemDelete(evt) {
		const listItem = evt.target.parentNode
		const index = parseInt(listItem.dataset.index, 10)
		let newValue = Array.from(this.state.value)
		newValue.splice(index, 1)
		this.changeValue(evt, newValue)
	}

	renderListItem(itemData, index) {
		return (
			<div className="do--text-list-input__item" key={index.toString()} data-index={index.toString()}>
				<Textarea
					minRows={1}
					name={this.props.name}
					value={this.state.value[index].description}
					className="do--text-list-input__control"

					onChange={this.handleItemChange.bind(this)} />
				<ui.Button label={Config.TextListInput.messages.delete} onClick={this.handleItemDelete.bind(this)} className="do--text-list-input__delete-button do--ui-button--small" />
			</div>
		)
	}

	renderEmptyListItem() {
		return (
			<div className="do--text-list-input__item">
				<Textarea
					minRows={1}
					name={this.props.name}
					value={this.state.newItemDescription}
					className="do--text-list-input__control"

					onChange={this.handleNewItemChange.bind(this)} />
				<ui.Button label={Config.TextListInput.messages.add} className="do--text-list-input__add-button do--ui-button--small" onClick={this.handleItemAdd.bind(this)} />
			</div>
		)
	}

	render() {
		const className = 'do--text-list-input ' + this.props.className
		const component = this;
		return (
			<div className={className}>
				{this.state.value.map( this.renderListItem.bind(this) )}
				{this.renderEmptyListItem()}
			</div>
		)
	}
}