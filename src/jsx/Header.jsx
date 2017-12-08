import React from 'react'
import { connect } from 'react-redux'

function Header({ title, login }) {

	return (
		<div>
			<h1 className="do--title">{title}</h1>
			<div className="do--float--right">{login}</div>
		</div>
	);
};

// export default connect(
// 	state => ({ userName: state.userName }),
// 	{ title }
// )(Header)



// export default Header

const mapStateToProps = (state) => {
    return {
        login: state.login,
        // hasErrored: state.itemsHasErrored,
        // isLoading: state.itemsIsLoading
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
//        fetchData: (url) => dispatch(itemsFetchData(url))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);