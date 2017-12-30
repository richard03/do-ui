import React from 'react'
import { connect } from 'react-redux'

import Config from './Config.jsx'
import ui from './ui/Elements.jsx'


function Header(props) {

	if (props.login && props.login.name) {
		return (
			<div className="do--float">
				<h1 className="do--title do--float__left">{props.title}</h1>

				<div className="do--float__right do--margin-wide--left">
					<div>{props.login.name}</div>
					<div><small><a href="https://accounts.google.com/logout">Odhlásit</a></small></div>
				</div>
			</div>
		)
	} else {
		// signing in...
		return (
			<div></div>
		)
	}

};

const mapStateToProps = (state) => {
	return {
		login: state.loginReducer.login
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		redirect: (position, parameters) => dispatch({ type: 'redirect', position, parameters }),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Header)