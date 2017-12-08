import React from 'react'
import { connect } from 'react-redux'

function Header({ title, name }) {

	return (
		<div>
			<h1 className="do--title">{title}</h1>
			<div className="do--float--right">{name}</div>
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
        name: state.name,
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