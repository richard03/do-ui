import React from 'react'
import { connect } from 'react-redux'

import ui from './uiElements.jsx'


function Header({ title, user, handleLogout }) {

	if (user && user.name) {
		return (
			<div className="do--float">
				<h1 className="do--title do--float__left">{title}</h1>
				<div className="do--float__right">
					<div>{user.name}</div>
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
		user: state.loginReducer.user
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		// no actions mapped
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Header)