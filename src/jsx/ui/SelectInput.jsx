import React from 'react'

import Config from '../Config.jsx'

/**
 * <SelectInput name value className handleValueChange>
 *     <option value>label</option>
 *     ...
 * </SelectInput>
 */
export default class SelectInput extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: props.value
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value) {
			this.setState({ value: nextProps.value })
		}
	}


	handleValueChange(evt) {
		this.setState({ value: evt.target.value })
		if (this.props.handleValueChange) {
			this.props.handleValueChange(evt, { name: this.props.name, value: evt.target.value } )
		}
	}

	render() {
		let className = 'do--ui-select-input ' + this.props.className
		return (
			<select
					name={this.props.name}
					value={this.state.value}
					className={this.props.className}

					onChange={this.handleValueChange.bind(this)}>
				{this.props.children}
			</select>
		)
	}
}
