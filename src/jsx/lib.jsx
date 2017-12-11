
function addClassName(elm, className) {
	elm.className += ' ' + className;
}

function getQueryVariable(varName) {
	try {
		const vars = String.prototype.split.apply(window.location, ['?'])[1].split("&");
		var pair, i = 0;
		do {
			pair = vars[i].split("=");
			if (pair[0] == varName) {
				return pair[1];
			}
		} while (i < vars.length);
	} catch(err) {
		return null;
	}
	return null;
}

function sendGetRequestToRestApi(url, authToken) {
	return new Promise( function (resolve, reject) {
		fetch(url, {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + btoa( authToken )
			})
			.then(result=>result.json())
			.then(data=>resolve(data));
	});
}

function sendPostRequestToRestApi(url, authToken, dataObject) {
	return new Promise(function (resolve, reject) {
		let postBody = new FormData();
		for (var k in dataObject) {
			if (dataObject.hasOwnProperty(k)) {
				postBody.set(k, dataObject[k]);
			}
		}
		fetch(url, {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + btoa( authToken ),
					method: 'POST',
					body: postBody
			})
			.then( responseData => resolve( responseData ) );
	});
}


function sendDeleteRequestToRestApi(url, authToken) {
	return new Promise(function (resolve, reject) {
		fetch(url, {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + btoa( authToken ),
				method: 'DELETE'
			})
			.then( responseData => resolve( responseData ) );
	});
}


export { addClassName, getQueryVariable, sendGetRequestToRestApi, sendPostRequestToRestApi, sendDeleteRequestToRestApi }