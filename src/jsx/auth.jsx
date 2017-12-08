
// import { initAuth2, getAuth2 } from './lib.jsx'

// let dispatcherComponent = this;

// var auth2;
// 	gapi.load('auth2', function () {
// 		auth2 = gapi.auth2.init({
// 			client_id: Config.gApiKey
// 		});
// 		// auth2.currentUser
// 		// auth2.signIn
// 		// auth2.signOut
// 		// console.log(auth2);
// 		// console.log(gapi.auth2);
// 		auth2.attachClickHandler('auth2-login-button', {}, onSuccess, onFailure);
// 	});

// 	function onSuccess(user) {
// 		dispatcherComponent.setState({ loggedIn: true });
// }

// function onFailure() {
// 		console.log('failure');
// 		// TODO: show message that login failed
// 	}

// 	var event = new Event('logout');
// window.addEventListener('logout', function () {
// 	auth2.signOut().then(function () {
// 		dispatcherComponent.setState({loggedIn: false});
// 	});
// })

