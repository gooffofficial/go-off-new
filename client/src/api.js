import axios from 'axios';

let isLocalhost =
	!process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export let API_LINK = isLocalhost
	? 'http://localhost:8000'
	: 'PRODUCTION_SITE_LINK_HERE';

export const sendEmailRegister = async (userInfo) => {
	try {
		let axiosResponse = await axios.post(
			`${API_LINK}/api/users/ecreate`,
			userInfo
		);
		let serverResponse = axiosResponse.data; // serverResponse returns us a huge HTML file that we dont need to use
	} catch (err) {
		console.log('error', err);
	}
};

export const sendSMSRegister = async (userInfo) => {
	try {
		let axiosResponse = await axios.post(
			`${API_LINK}/api/users/screate`,
			userInfo
		);
		let serverResponse = axiosResponse.data;
	} catch (err) {
		console.log('error', err);
	}
};

export const sendVerifyCheck = async (email, verifyCode) => {
	// Basically, if there is no error then the verify code was correct!
	try {
		let axiosResponse = await axios.get(
			`${API_LINK}/api/users/verification?email=${email}&smscode=${verifyCode}`
		);
		let serverResponse = axiosResponse.data;
		return true;
	} catch (err) {
		console.log('error', err);
		return false;
	}
};
