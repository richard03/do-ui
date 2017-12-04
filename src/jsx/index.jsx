import React from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Route,
	Switch,
	Link,
	Redirect
} from 'react-router-dom'


import Config from './Config.jsx'
import TaskList from './TaskList.jsx'
import Task from './Task.jsx'

ReactDOM.render(
	<Router>
		<Switch>
			<Route exact path={Config.taskDetailScreenPath} component={Task}/>
			<Route component={TaskList}/>
		</Switch>
	</Router>,
	document.getElementById('app')
);