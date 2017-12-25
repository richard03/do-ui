import React from 'react'
import Textarea from 'react-textarea-autosize'

/**
 * <TextInput name value className handleValueChange>
 * allows basic text input
 */
export default class TextInput extends React.Component {

	constructor(props) {
	super(props)
	this.state = {
			value: props.value
		}
	}

	componentWillReceiveProps(nextProps) {
		if (typeof nextProps.value == 'string') {
			this.setState({ value: nextProps.value })
		}
	}

	handleValueChange(evt) {
		this.setState({ value: evt.target.value })
		if (this.props.handleValueChange) {
			this.props.handleValueChange(evt, { name: this.props.name, value: evt.target.value })
		}
	}

	render() {
		let className = 'do--text-input ' + this.props.className
		return (
			<Textarea
				minRows={1}
				name={this.props.name}
				value={this.props.value}
				className={className}

				onChange={this.handleValueChange.bind(this)} />
		)
	}
}

