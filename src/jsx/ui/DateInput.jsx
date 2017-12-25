import React from 'react'
import Moment from 'moment'
import DatePicker from 'react-datepicker'

import Config from '../Config.jsx'

/**
 * <DateInput name value dateFormat className handleValueChange handleClickOutside />
 * allows to input date or select it from date picker. Stores and passes the date in univerzal format YYYY-MM-DD
 */
export default class DateInput extends React.Component {

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

	handleValueChange(date) {
		const value = date.format('YYYY-MM-DD')
		this.setState({ value })
		if (this.props.handleValueChange) {
			const fakeEvent = {
				target: {
					name: this.props.name,
					value: value
				}
			}
			this.props.handleValueChange(fakeEvent, { name: this.props.name, value })
		}
	}

	render() {
		let className = 'do--date-input ' + this.props.className
		return (
			<DatePicker
				selected={Moment(this.state.value)}
				dateFormat={this.props.dateFormat}
				className={className}

				onChange={this.handleValueChange.bind(this)}
				onClickOutside={this.props.handleClickOutside} />
		)
	}
}