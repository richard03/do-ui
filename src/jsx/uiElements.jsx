import React from 'react'

import Moment from 'moment'
import DatePicker from 'react-datepicker'



export default {
	textField: textField,
	selectField: selectField,
	dateField: dateField,
	textAreaField: textAreaField,
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


function textField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<label className="do--data-field__label">{props.label}</label>
					<input type="text" name={props.name} value={props.value} onChange={props.onValueChange} className="do--data-field__control do--data-field__control--wide"/>
				</div>
			)
		default: // view mode
			return (
				<div className={className} onClick={props.onClick}>
					{props.value}
					<input type="hidden" name={props.name} value={props.value}/>
				</div>
			)
	}
}

function dateField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className="do--data-field">
					<label className="do--data-field__label">{props.label}</label>
					<DatePicker
						selected={Moment(props.value)}
						onChange={props.onValueChange}
						dateFormat={props.dateFormat}
						className="do--data-field__control"
					/>
				</div>
			)
		default: // in view mode
			return (
				<div className={className} onClick={props.onClick}>
					<h3 className="do--data-field__label">{props.label}</h3>
					{Moment(props.value).format(props.dateFormat)}
				</div>
			)
	}
}

function selectTag(props) {
	let buffer = [];
	buffer.push('<option value=""></option>');
	props.options.forEach(function (option) {
		buffer.push('<option value="');
		buffer.push(option.value);
		buffer.push('">');
		buffer.push(option.label);
		buffer.push('</option>');
	});
	let optionsHtml = buffer.join('');
	return(
		<select name={props.name} value={props.value} onChange={props.onValueChange} className="do--data-field__control">
			{optionsHtml}
		</select>
	);
}

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

function selectField(props) {
	let className = 'do--data-field do--data-field--select';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<label className="do--data-field__label">{props.label}</label>
					<select name={props.name} value={props.value} onChange={props.onValueChange} className="do--data-field__control">
						{props.options.map(function (option) {
							return <option key={props.name + option.value} value={option.value}>{option.label}</option>;
						})}
					</select>
				</div>
			)
		default: // view mode
			return (
				<div className={className} onClick={props.onClick}>
					{selectView(props)}
					<input type="hidden" name={props.name} value={props.value}/>
				</div>
			)
	}
}

function textAreaField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<label className="do--data-field__label">{props.label}</label>
					<textarea name={props.name} value={props.value} onChange={props.onValueChange} className="do--data-field__control do--data-field__control--wide"></textarea>
				</div>
			)
		default: // in view mode
			return (
				<div className={className} onClick={props.onClick}>
					<h3 className="do--data-field__label">{props.label}</h3>
					{props.value.split('\n').map( (item, i) =>  
						<p key={props.name + '-line-' + i}>{item}</p>
					)}
					<input type="hidden" name={props.name} value={props.value}/>
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
		<button className={className} onClick={props.onClick}>{props.label}</button>
	)
}

/**
 * Non-submitting button
 */
function button(props) {
	let className = ['do--button', props.className].join(' ');
	return (
		<button type='button' className={className} onClick={props.onClick}>{props.label}</button>
	)
}