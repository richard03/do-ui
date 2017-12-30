export default {
	addClassName,
	forEach,
	convertToArray,
	addUniqueItem,
	getQueryVariable, 
	sendGetRequestToRestApi, 
	sendPostRequestToRestApi, 
	sendDeleteRequestToRestApi,
	createRandomId,
	convertIdToCode,
	convertCodeToId
}





function addClassName(elm, className) {
	elm.className += ' ' + className;
}


/**
 * For each item of "iterable" object - Array, Object etc.
 * calls the "callback" once
 */
function forEach(iterable, callbackFn) {
	for(var key in iterable) {
		if (iterable.hasOwnProperty(key)) {
			callbackFn(iterable[key])
		}
	}
}



/**
 * Takes iterable object and converts it into the array (so you can do mapping on it, for instance)
 */
function convertToArray(iterable) {
	let result = []
	for(var key in iterable) {
		if (iterable.hasOwnProperty(key)) {
			result.push(iterable[key])
		}
	}
	return result
}



/**
 * Adds an item to the array,
 * but only if the item is not in the array yet
 */
function addUniqueItem(arr, newItem) {
	for (let i = 0; i < arr.length; i++) {
		if ( arr[i] === newItem ) {
			return arr
		}
	}
	arr.push(newItem)
	return arr
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



function createRandomId(maxId) {
	return Math.floor(Math.random() * maxId)
}



/**
 * Takes ID number and transforms it to easily readable code
 */
function convertIdToCode(id) {
	const codeArray = id.toString(36).split('')
	const lastIndex = codeArray.length - 1
	
	let buffer = []
	for (let i = 0; i <= lastIndex; i++ ) {
		if ( (i % 4 == 0) && (i != 0) ) {
			buffer.push('-')
		}
		buffer.push(codeArray[lastIndex - i])
	}
	let code = buffer.reverse().join('')
	return code
}





/**
 * Takes code to ID number
 */
function convertCodeToId(code) {
	let codeString = code.replace(new RegExp('-', 'gi'), '')
	return parseInt(codeString, 36)
}



