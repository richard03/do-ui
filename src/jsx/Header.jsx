import React from 'react'
import { connect } from 'react-redux'

function Header({ userName, title }) {

	return (
		<div>
			<h1 className="do--title">{title}</h1>
			<div className="do--float--right">{userName}</div>
		</div>
	);
};

export default connect(
	state => ({ userName: state.userName }),
	{ title }
)(Header)
// export default Header