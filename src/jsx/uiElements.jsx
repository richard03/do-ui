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

	TextAreaField: TextAreaField,

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
 * <TextInput name value handleValueChange className>
 */
function TextInput(props) {
	let className = 'do--ui-text-input ' + props.className
	return (
		<input type="text" name={props.name} value={props.value} onChange={props.handleValueChange} className={className} />
	)
}

/**
 * <TextView text name value className>
 */
function TextView(props) {
	return (
		<span className={props.className}>
			{props.value}
			<input type="hidden" name={props.name} value={props.value} />
		</span>
	)
}



/**
 * <DatePicker value dateFormat className handleValueChange handleClickOutside />
 */
function DateInput(props) {
	let className = 'do--ui-date-picker ' + props.className
	return (
		<DatePicker
			selected={Moment(props.value)}
			onChange={props.handleValueChange}
			onClickOutside={props.handleClickOutside}
			dateFormat={props.dateFormat}
			className={className} />
	)
}

/**
 * <TextView text name value dateFormat className>
 */
function DateView(props) {
	return (
		<span className={props.className}>
			{Moment(props.value).format(props.dateFormat)}
			<input type="hidden" name={props.name} value={props.value} />
		</span>
	)
}



/**
 * <Select name value handleValueChange className>
 */
function Select(props) {
	return (
		<select name={props.name} value={props.value} onChange={props.handleValueChange} className={props.className}>
			{props.children}
		</select>
	)
}

/**
 * Text content for SELECT
 */
function SelectView(props) {
	let i = 0;
	while (i < props.children.length) {
		// not sure what type is a value, it may even lack the toString method - so I convert it to string another way:
		if ( ("" + props.children[i].props.value) === ("" + props.value) ) {
			return (
				<span className={props.className}>
					{props.children[i].props.children}
					<input type="hidden" name={props.name} value={props.value} />
				</span>
			)
		}
		i++;
	}
	return ""
}





// /**
//  * SELECT
//  */
// function SelectField(props) {
// 	let className = 'do--data-field do--data-field--select';
// 	if (props.className) className += ' ' + props.className;
// 	switch (props.mode) {
// 		case 'create':
// 		case 'edit':
// 			return (
// 				<div className={className}>
// 					<FieldLabel text={props.label} mode={props.mode} />
// 					<select name={props.name} value={props.value} onChange={props.handleValueChange} className="do--data-field__control">
// 						{props.options.map(function (option) {
// 							return <option key={props.name + option.value} value={option.value}>{option.label}</option>;
// 						})}
// 					</select>
// 				</div>
// 			)
// 		default: // view mode
// 			return (
// 				<div className={className}>
// 					<FieldLabel text={props.label} mode={props.mode} />
// 					{selectView(props)}
// 					<input type="hidden" name={props.name} value={props.value}/>
// 				</div>
// 			)
// 	}
// }



/**
 * TEXTAREA
 */
function TextAreaField(props) {
	let className = 'do--data-field';
	if (props.className) className += ' ' + props.className;
	switch (props.mode) {
		case 'create':
		case 'edit':
			return (
				<div className={className}>
					<FieldLabel text={props.label} mode={props.mode} />
					<Textarea
						minRows={1}
						name={props.name}
						value={props.value}
						onChange={props.handleValueChange}
						className="do--data-field__control do--data-field__control--wide" />
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
 * Submit button
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


