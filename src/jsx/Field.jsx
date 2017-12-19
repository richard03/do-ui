import React from 'react'

import ui from './uiElements.jsx'
import Config from './Config.jsx'

/**
 * <Field type name value handleValueChange mode className>...</Field>
 */
export default class Field extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mode: props.mode,
			value: props.value,
			oldValue: props.value
		}
	}
	setMode(newMode) {
		this.setState({ mode: newMode })
	}
	handleValueChange(evt, value) {
		this.setState({value: value})
	}
	acceptValueChange(evt, value) {
		this.setState({ oldValue: this.state.value })
		if (this.state.mode == 'edit') {
			this.setMode('view')
		}
		if (typeof this.props.handleValueChange == 'function') {
			this.props.handleValueChange(evt, this.props.name, value) // couldn't use this.state.value, it may not be set yet
		}
	}
	rejectValueChange() {
		this.setState({ value: this.state.oldValue })
		if (this.state.mode == 'edit') {
			this.setMode('view')
		}
	}
	render() {
		const component = this;
		let className = 'do--data-field';
		if (component.props.className) className += ' ' + component.props.className;
		return (
			<div className={className} data-name={component.props.name}>
				<ui.FieldLabel text={component.props.label} mode={component.state.mode} />
				{(function () {
						switch (component.props.type) {
							case 'text': return (
									<TextControl
										name={component.props.name}
										value={component.state.value}
										mode={component.state.mode}
										handleValueChange={component.handleValueChange.bind(component)}
										acceptValueChange={component.acceptValueChange.bind(component)}
										rejectValueChange={component.rejectValueChange.bind(component)}
									/>
								)
							case 'date': return (
									<DateControl
										name={component.props.name}
										value={component.state.value}
										mode={component.state.mode}
										handleValueChange={component.handleValueChange.bind(component)}
										acceptValueChange={component.acceptValueChange.bind(component)}
										rejectValueChange={component.rejectValueChange.bind(component)}
									/>

								)
							case 'select': return (
									<SelectControl
											name={component.props.name}
											value={component.state.value}
											mode={component.state.mode}
											handleValueChange={component.handleValueChange.bind(component)}
											acceptValueChange={component.acceptValueChange.bind(component)}
											rejectValueChange={component.rejectValueChange.bind(component)} 
									>
										{component.props.children}
									</SelectControl>
								)

							default: return component.props.children
						}
					}).call()
				}
				<ui.Show if={component.state.mode == 'view'}>
					<ui.Button
						label={Config.messages.switchToEditMode}
						className="do--data-field__edit-button do--button--small"
						onClick={component.setMode.bind(component, 'edit')} />
				</ui.Show>
			</div>
		)
	}
}



function TextControl(props) {

	function handleValueChange(evt) {
		const value = evt.target.value
		props.handleValueChange(evt, value)
	}
	function acceptValueChange(evt) {
		const value = evt.target.value
		props.acceptValueChange(evt, value)
	}


	return (
		<div className="do--float">
			<ui.Show if={props.mode == 'view'}>
				<ui.TextView
					name={props.name}
					value={props.value} />
			</ui.Show>
			<ui.Hide if={props.mode == 'view'}>
				<div className="do--data-field__controls do--float__left">
					<ui.TextInput
						name={props.name}
						value={props.value}
						handleValueChange={handleValueChange}
						className="do--data-field__control" />
				</div>
			</ui.Hide>
			<ui.Show if={props.mode == 'edit'}>
				<div className="do--data-field__control-buttons do--float__left">
					<ui.Button label='OK' onClick={acceptValueChange} className='do--data-field__accept-button do--button--small' />
					<ui.Button label='X' onClick={props.rejectValueChange} className='do--data-field__reject-button do--button--small' />
				</div>
			</ui.Show>
		</div>
	)
}


function DateControl(props) {

	function handleDateChange(date) {
		const value = date.format(Config.apiDateTimeFormat)
		const fakeEvent = {
			target: {
				name: props.name,
				value: value
			}
		}
		props.handleValueChange(fakeEvent, value)
		props.acceptValueChange(fakeEvent, value)
	}


	return (
		<div className=" do--float">
			<ui.Show if={props.mode == 'view'}>
				<ui.DateView
					dateFormat={Config.viewDateFormat}
					name={props.name}
					value={props.value} />
			</ui.Show>
			<ui.Hide if={props.mode == 'view'}>
				<div className="do--data-field__controls do--float__left">
 					<ui.DateInput
 						name={props.name}
	 					value={props.value}
 						dateFormat={Config.viewDateFormat}
 						handleValueChange={handleDateChange}
	 					className="do--data-field__control" />
	 			</div>
 			</ui.Hide>
			<ui.Show if={props.mode == 'edit'}>
				<div className="do--data-field__control-buttons do--float__left">
					<ui.Button label='X' onClick={props.rejectValueChange} className='do--data-field__reject-button do--button--small' />
				</div>
			</ui.Show>

 		</div>
 	)
}



function SelectControl(props) {

	function handleValueChange(evt) {
		// const index = evt.nativeEvent.target.selectedIndex
		// const value = evt.nativeEvent.target[index].value
		const value = evt.target.value
		props.handleValueChange(evt, value)
		props.acceptValueChange(evt, value)
	}

	return (
		<div className="do--float">
			<ui.Show if={props.mode == 'view'}>
				<ui.SelectView
						name={props.name}
						value={props.value}>
					{props.children}
				</ui.SelectView>
			</ui.Show>
			<ui.Hide if={props.mode == 'view'}>
				<div className="do--data-field__controls do--float__left">
					<ui.Select
							name={props.name}
							value={props.value}
							handleValueChange={handleValueChange}
							className="do--data-field__control">
						{props.children}
					</ui.Select>
				</div>
			</ui.Hide>
			<ui.Show if={props.mode == 'edit'}>
				<div className="do--data-field__control-buttons do--float__left">
					<ui.Button label='X' onClick={props.rejectValueChange} className='do--data-field__reject-button do--button--small' />
				</div>
			</ui.Show>
		</div>
	)
}