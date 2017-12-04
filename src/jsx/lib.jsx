
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


export { addClassName, getQueryVariable }