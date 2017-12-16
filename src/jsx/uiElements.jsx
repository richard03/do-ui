import React from 'react'

import Moment from 'moment'
import DatePicker from 'react-datepicker'



export default {
	textField: textField,
	selectField: selectField,
	dateField: dateField,
	textAreaField: textAreaField,

	textList: textList,

	submitButton: submitButton,
	button: button,

	hide: hide,
	show: show
}



/**
 * Show tag content
 *    - if condition is fulfilled
 *    - unless condition is fulfilled
 */
function show(props) {
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
 * Hide tag content
 *    - if condition is fulfilled
 *    - unless condition is fulfilled
 */
function hide(props) {
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
 * INPUT
 */
function textField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					<input type="text" name={props.name} value={props.value} onChange={props.handleValueChange} className="do--data-field__control do--data-field__control--wide"/>
				</div>
			)
		default: // view mode
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					{props.value}
					<input type="hidden" name={props.name} value={props.value}/>
				</div>
			)
	}
}



/**
 * DATEPICKER
 */
function dateField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className="do--data-field">
					<FieldLabel text={props.label} mode={props.mode} />
					<DatePicker
						selected={Moment(props.value)}
						onChange={props.handleValueChange}
						dateFormat={props.dateformat}
						className="do--data-field__control"
					/>
				</div>
			)
		default: // in view mode
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					{Moment(props.value).format(props.dateFormat)}
				</div>
			)
	}
}



/**
 * Text content for SELECT
 */
function selectView(props) {
	let i = 0;
	while (i < props.options.length) {
		// not sure what type is a value, it may even lack the toString method - so I convert it to string another way:
		if ( ("" + props.options[i].value) === ("" + props.value) ) {
			return props.options[i].label;
		}
		i++;
	}
}



/**
 * SELECT
 */
function selectField(props) {
	let className = 'do--data-field do--data-field--select';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					<select name={props.name} value={props.value} onChange={props.handleValueChange} className="do--data-field__control">
						{props.options.map(function (option) {
							return <option key={props.name + option.value} value={option.value}>{option.label}</option>;
						})}
					</select>
				</div>
			)
		default: // view mode
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					{selectView(props)}
					<input type="hidden" name={props.name} value={props.value}/>
				</div>
			)
	}
}



/**
 * TEXTAREA
 */
function textAreaField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					<textarea name={props.name} value={props.value} onChange={props.handleValueChange} className="do--data-field__control do--data-field__control--wide"></textarea>
				</div>
			)
		default: // in view mode
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					{props.value.split('\n').map( (item, i) =>  
						<p key={props.name + '-line-' + i}>{item}</p>
					)}
					<input type="hidden" name={props.name} value={props.value}/>
				</div>
			)
	}
}





/**
 * TEXTLIST
 * List of texts
 */
function textList(props) {
	let className = 'do--data-field ' + props.className;
	let itemClassName = '';
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					{props.value.map( function (item, i) {
						return (
							<div className={itemClassName} key={'textListItem-' + i}>
								<textarea className="do--data-field__control do--data-field__control--wide"></textarea>
							</div>
						)
					} )}
				</div>
			)
		default: // in view mode
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					{props.value.map( function (item, i) {
						return (
							<div className={itemClassName} key={'textListItem-' + i}>
								<label><input type="checkbox" /> {item}</label>
							</div>
						)
					} )}
				</div>
			)
	}
}




/**
 * Submit button
 */
function submitButton(props) {
	let className = ['do--button', props.className].join(' ');
	return (
		<button {...props} className={className}>{props.label}</button>
	)
}



/**
 * Non-submitting button
 */
function button(props) {
	let className = ['do--button', props.className].join(' ');
	return (
		<button {...props} type='button' className={className}>{props.label}</button>
	)
}





function FieldLabel(props) {
	// if (props.text && (props.text !== '') ) {
	// 	return ''
	// } else {
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
	// }
}