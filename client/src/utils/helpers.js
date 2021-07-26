// SHOULD BE USE IN USEEFFECT
export const getCookie = (key) => {
	let cookie = document.cookie;

	if (cookie) {
		cookie = cookie
			.split(';')
			.find((pair) => pair.trim().startsWith(`${key}=`))
			.split('=')[1];
	}

	return cookie === undefined ? cookie : false;
};

// SHOULD BE USE IN USEEFFECT
// hard coded token gen for development purposes
// REMINDER: PUT TOKEN IN .ENV
export const generateToken = () => {
	return (document.cookie = process.JWTTOKEN);
};
