import React from 'react'
import Moment from 'moment'
import DatePicker from 'react-datepicker'
import Textarea from 'react-textarea-autosize'

import Config from './Config.jsx'


export default {

	TextInput: TextInput,
	TextView: TextView,

	DateInput: DateInput,
	DateView: DateView,

	Select: Select,
	SelectView: SelectView,

	SubmitButton: SubmitButton,
	Button: Button,

	Hide: Hide,
	Show: Show,

	FieldLabel: FieldLabel
}



/**
 * <Show if>...</Show>
 * Show tag content
 *    - if condition is fulfilled
 *    - unless condition is fulfilled
 */
function Show(props) {
	if (typeof props.if != 'undefined') {
		if (props.if === true) {
			return (props.children)
		} else {
			return null;
		}
	}
	return props.children;
}

/**
 * <Hide if>...</Hide>
 * Hide tag content
 *    - if condition is fulfilled
 *    - unless condition is fulfilled
 */
function Hide(props) {
	if (typeof props.if != 'undefined') {
		if (props.if === true) {
			return null;
		} else {
			return props.children;
		}
	}
	return null;
}

/**
 * <FieldLabel mode text />
 */
function FieldLabel(props) {
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<label className="do--data-field__label">{props.text}</label>
			)
		default: // in view mode
			return (
				<h3 className="do--data-field__label">{props.text}</h3>
			)
	}
}

/**
 * <TextInput name value className handleValueChange>
 */
class TextInput extends React.Component {

	constructor(props) {
	super(props)
	this.state = {
			value: props.value
		}
	}

	handleValueChange(evt) {
		this.setState({ value: evt.target.value })
		if (props.handleValueChange) {
			props.handleValueChange(evt, evt.target.value)
		}
	}

	render() {
		let className = 'do--ui-text-input ' + this.props.className
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


/**
 * <TextView value className>
 */
function TextView(props) {
	const className = 'do--ui-text-view ' + this.props.className
	return (
		<span className={className}>{props.value}</span>
	)
}



/**
 * <DateInput name value dateFormat className handleValueChange handleClickOutside />
 */
 class DateInput extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: props.value
		}
	}

	handleValueChange(date) {
		const value = date.format('YYYY-MM-DD')
		this.setState({ value })
		if (props.handleValueChange) {
			const fakeEvent = {
				target: {
					name: props.name,
					value: value
				}
			}
			props.handleValueChange(fakeEvent, value)
		}
	}

	render() {
		let className = 'do--ui-date-input ' + props.className
		return (
			<DatePicker
				selected={Moment(this.state.value)}
				dateFormat={props.dateFormat}
				className={className}

				onChange={this.handleValueChange.bind(this)}
				onClickOutside={props.handleClickOutside} />
		)
	}
}

/**
 * <DateView value dateFormat className>
 */
function DateView(props) {
	const className = 'do--ui-date-view ' + props.className
	return (
		<span className={props.className}>{Moment(props.value).format(props.dateFormat)}</span>
	)
}



/**
 * <SelectInput name value className handleValueChange>
 *     <option value>label</option>
 *     ...
 * </SelectInput>
 */
class SelectInput extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: props.value
		}
	}

	handleValueChange(evt) {
		this.setState({ value: evt.target.value })
		if (props.handleValueChange) {
			props.handleValueChange(evt, evt.target.value)
		}
	}

	render() {
		let className = 'do--ui-select-input ' + props.className
		return (
			<select
					name={props.name}
					value={props.value}
					className={props.className}

					onChange={this.handleValueChange.bind(this)}>
				{props.children}
			</select>
		)
	}
}

/**
 * <SelectView value className>{options}</SelectView>
 */
function SelectView(props) {
	const className = 'do--ui-select-view ' + props.className
	let i = 0;
	while (i < props.children.length) {
		// not sure what type is a value, it may even lack the toString method - so I convert it to string another way:
		if ( ("" + props.children[i].props.value) === ("" + props.value) ) {
			return (
				<span className={className}>
					{props.children[i].props.children}
				</span>
			)
		}
		i++;
	}
	return ""
}






/**
 * <CheckListInput name value[] className handleValueChange>
 *     <option value>label</option>
 *     ...
 * </CheckListInput>
 */
class CheckListInput extends React.Component {

	constructor(props) {
		super(props)
		let options = props.children.map( (optionElm) => {
			let option = { value: optionElm.props.value, label: optionElm.props.children, selected: false }
			props.value.forEach( function (item) {
				if ( option.value === item ) {
					option.selected = true
				}
			})
			return option
		})
		this.state = {
			options
		}

	}

	handleValueChange(evt) {
		const component = this
		let newOptions = []
		let newValue = []
		this.state.options.forEach(function (option) {
			let newOption = Object.assign({}, option)
			if ( newOption.value === evt.target.value ) {
				newOption.selected = true
				newValue.push(evt.target.value)
			}
			newOptions.push(newOption.evt.target.value)
		})
		this.setState({ options: newOptions })
		if (props.handleValueChange) {
			props.handleValueChange(evt, newValue)
		}
	}

	render() {
		let className = 'do--ui-check-list-input ' + props.className
		return (
			<div className={className}>
				{this.state.options.map( (option) => {
					return (
						<div>
							<label>
								<input type="checkbox" name={this.props.name} value={option.value} checked={option.checked} onChange={this.handleValueChange.bind(this)} />
								{option.label}
							</label>
						</div>
					)
				})}

			</div>
		)
	}
}

/**
 * <SelectView value className>{options}</SelectView>
 */
// function SelectView(props) {
// 	const className = 'do--ui-select-view ' + props.className
// 	let i = 0;
// 	while (i < props.children.length) {
// 		// not sure what type is a value, it may even lack the toString method - so I convert it to string another way:
// 		if ( ("" + props.children[i].props.value) === ("" + props.value) ) {
// 			return (
// 				<span className={className}>
// 					{props.children[i].props.children}
// 				</span>
// 			)
// 		}
// 		i++;
// 	}
// 	return ""
// }


// /**
//  * TEXTLIST
//  * List of texts
//  */
// function TodoList(props) {
// 	let className = 'do--data-field do--todo-list ' + props.className
// 	let itemClassName = 'do--todo-list__item ' + props.itemClassName
// 	let addButtonClassName = 'do--todo-list__add-button ' + props.itemClassName
// 	switch (props.mode) {
// 		case 'create':
// 		case 'edit':
// 			return (
// 				<div className={className} data-name={props.name}>
// 					<FieldLabel text={props.label} mode={props.mode} />
// 					{props.value.map( function (item, i) {
// 						return (
// 							<div className={itemClassName} key={i.toString()} data-index={i.toString()}>
// 								<Textarea
// 									minRows={1}
// 									name={props.name}
// 									value={props.value[i].description}
// 									onChange={props.itemChangeHandler}
// 									className="do--data-field__control do--data-field__control--wide" />
// 								<Button label="x" onClick={props.itemDeleteHandler} className="do--todo-list__delete-button" />
// 							</div>
// 						)
// 					} )}
// 					<Button label={Config.messages.addNext} onClick={props.itemAddHandler} className={addButtonClassName} />
// 				</div>
// 			)
// 		default: // in view mode
// 			return (
// 				<div className={className}>
// 					<FieldLabel text={props.label} mode={props.mode} />
// 					{props.value.map( function (item, i) {
// 						return (
// 							<div className={itemClassName} key={i.toString()}>
// 								<label><input
// 									type="checkbox"
// 									name={props.name}
// 									checked={item.checked}
// 									onChange={props.itemCheckHandler}
// 									/> {item.description}</label>
// 							</div>
// 						)
// 					} )}
// 				</div>
// 			)
// 	}
// }




/**
 * Submit button - DEPRECATED
 */
function SubmitButton(props) {
	let className = ['do--button', props.className].join(' ');
	return (
		<button {...props} className={className}>{props.label}</button>
	)
}



/**
 * Non-submitting button
 * <Button label onClick className />
 */
function Button(props) {
	let className = ['do--button', props.className].join(' ');
	return (
		<button {...props} type='button' className={className}>{props.label}</button>
	)
}


