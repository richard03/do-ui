import React from 'react'
import Moment from 'moment'
import Textarea from 'react-textarea-autosize'

import IconWarning from 'react-icons/lib/md/warning'
import IconChecked from 'react-icons/lib/md/check-box'

import Config from '../Config.jsx'


export default {

	Hide, // hides content, if condition is fulfilled
	Show,  // shows content, if condition is fulfilled

	Field, // adds label and other boilerplate code to form field

	TextView, // shows text value
	// TextListView - not implemented yet
	DateView, // shows date in given format
	SelectView, // shows selected option as text

	Icon, // SVG icon, could be used inline in text

	Button // simple button wrapped for simple use

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
 * <Field type name value handleValueChange mode className>...</Field>
 */
function Field(props) {
	let className = 'do--ui-data-field';
	if (props.className) className += ' ' + props.className;
	return (
		<div className={className}>
			<label className="do--ui-data-field__label">{props.label}</label>
			{props.children}
		</div>
	)
}



/**
 * <TextView value className>
 */
function TextView(props) {
	const className = 'do--ui-text-view ' + props.className
	return (
		<span className={className}>{props.value}</span>
	)
}







/**
 * <DateView value dateFormat className>
 */
function DateView(props) {
	const className = 'do--ui-date-view ' + props.className
	return (
		<span className={props.className}>
			{Moment(props.value).format(props.dateFormat)}
		</span>
	)
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
 * SVG icon
 * <Icon type="..." />
 */
function Icon(props) {
	let className = ['do--ui-icon', 'do--ui-icon--' + props.type, props.className].join(' ')

	function renderIcon(type) {
		switch (type) {
			case 'warning': return <IconWarning />
			case 'checked': return <IconChecked />
		}
	}

	return (
		<span {...props} className={className}>
			{renderIcon(props.type)}
		</span>
	)
}



/**
 * Non-submitting button
 * <Button label className onClick />
 */
function Button(props) {
	let className = ['do--ui-button', props.className].join(' ');
	return (
		<button {...props} type='button' className={className}>{props.label}</button>
	)
}


