import React from 'react'
import { connect } from 'react-redux'


// import {
// 	Router,
// 	Route,
// 	Switch
// } from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory'
// import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Config from './Config.jsx'
import ui from './ui/Elements.jsx'

import TaskList from './TaskList.jsx'
import Task from './Task.jsx'



class Application extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<ui.Show if={this.props.position == 'taskList'}>
					<TaskList />
				</ui.Show>
				<ui.Show if={this.props.position == 'task'}>
					<Task />
				</ui.Show>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		position: state.navigationReducer.position,
		parameters: state.navigationReducer.parameters
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		redirect: (position) => dispatch({ type: 'redirect', position })
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Application)
