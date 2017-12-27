import React from 'react'

import Config from '../Config.jsx'


/**
 * <CheckListInput name value[] className handleValueChange>
 *     <option value>label</option>
 *     ...
 * </CheckListInput>
 *
 * "multiselect" - allows to select multiple options from the list of options and pass array of values
 */
export default class CheckListInput extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			value: props.value
		}

	}

	handleValueChange(evt) {
		const targetDescription = evt.target.value
		const targetChecked = evt.target.checked
		let newValue = this.state.value.map( function (item) {
			// let newOption = Object.assign({}, option)
			if ( item.description === targetDescription ) {
				return { description: targetDescription, checked: targetChecked }
			}
			return item
		})
		this.setState({ value: newValue })
		if (this.props.handleValueChange) {
			this.props.handleValueChange(evt, { name: this.props.name, value: newValue })
		}
	}

	render() {
		let className = 'do--check-list-input ' + this.props.className
		return (
			<div className={className}>
				{this.state.value.map( (option, index) => {
					return (
						<div key={index.toString()}>
							<label>
								<input
									type="checkbox"
									name={this.props.name}
									value={option.description}
									checked={option.checked}

									onChange={this.handleValueChange.bind(this)} />
								{option.description}
							</label>
						</div>
					)
				})}

			</div>
		)
	}
}