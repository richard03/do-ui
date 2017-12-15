
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



/**
 * cfg = { url, login: { token_type, access_token } }
 */
function sendGetRequestToRestApi(cfg) {
	return new Promise( function (resolve, reject) {
		if (cfg.login && cfg.login.access_token) {
			fetch(cfg.url, {
					cache: "no-store",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': cfg.login.token_type + " " + cfg.login.access_token,
						'Access-Control-Allow-Origin': '*'
					}
				})
				.then(result=>result.json())
				.then(data=>resolve(data));
		} else {
			reject({ message: "Couldn't connect - access_token missing." });
		}
	});
}

/**
 * cfg = { url, login: { token_type, access_token } }
 */
function sendPostRequestToRestApi(cfg, dataObject) {
	return new Promise(function (resolve, reject) {
		if (cfg.login && cfg.login.access_token) {
			let postBody = new FormData();
			for (var k in dataObject) {
				if (dataObject.hasOwnProperty(k)) {
					postBody.set(k, dataObject[k]);
				}
			}
			fetch(cfg.url, {
					headers: {
						'Authorization': cfg.login.token_type + " " + cfg.login.access_token,
						'Access-Control-Allow-Origin': '*'
					},
					method: 'POST',
					body: postBody
				})
				.then( responseData => resolve( responseData ) );
		} else {
			reject({ message: "Couldn't connect - access_token missing." });
		}
	});
}

/**
 * cfg = { url, login: { token_type, access_token } }
 */
function sendDeleteRequestToRestApi(cfg) {
	return new Promise(function (resolve, reject) {
		if (cfg.login && cfg.login.access_token) {
			fetch(cfg.url, {
					headers: {
						'Authorization': cfg.login.token_type + " " + cfg.login.access_token,
						'Access-Control-Allow-Origin': '*',
					},
					method: 'DELETE'
				})
				.then( responseData => resolve( responseData ) );
		} else {
			reject({ message: "Couldn't connect - access_token missing." });
		}
	});
}


export { addClassName, getQueryVariable, sendGetRequestToRestApi, sendPostRequestToRestApi, sendDeleteRequestToRestApi }