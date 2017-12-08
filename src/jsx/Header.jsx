import React from 'react'
import { connect } from 'react-redux'

function Header({ title, login, handleLogin }) {

	if (login) {
		return (
			<div className="do--float">
				<h1 className="do--title do--float__left">{title}</h1>
				<div className="do--float__right">{login}</div>
			</div>
		);
	} else { // not logged in
		return (
			<div className="do--float">
				<h1 className="do--title do--float__left">{title}</h1>
				<div className="do--float__right">
					<button className="do-button" onClick={handleLogin}>Přihlášení</button>
				</div>
			</div>
		);
	}

};


// function handleLogin() {
// 	store.dispatch({ type: 'login', login: 'richard.sery.3@gmail.com' });
// }

// export default connect(
// 	state => ({ userName: state.userName }),
// 	{ title }
// )(Header)



// export default Header

const mapStateToProps = (state) => {
	return {
		login: state.login
		// hasErrored: state.itemsHasErrored,
		// isLoading: state.itemsIsLoading
	};
};
const mapDispatchToProps = (dispatch) => {
    return {
    		handleLogin: function () {
    			return dispatch({ type: 'login', login: 'richard.sery.3@gmail.com' })
    		}
//        fetchData: (url) => dispatch(itemsFetchData(url))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);