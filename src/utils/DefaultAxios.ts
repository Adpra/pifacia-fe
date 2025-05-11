import axios from "axios";

const defaultAxios = axios.create({
	// baseURL: process.env.REACT_APP_BASE_API,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	}
});

// const isLogin = error.response.config.url.match(/login/);

if (localStorage.getItem('access_token')) {
	defaultAxios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
}

defaultAxios.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	return response;
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error

	// unauthenticated
	if (error.response?.status === 401) {
		localStorage.removeItem('access_token');

		window.location.reload();
	}

	if (error.response?.status === 422) {
		console.log(error.response);
		return;
	}

	if (error.response?.status === 500) {
		console.log(error.response);
		return;
	}

	console.log(error);

	return Promise.reject(error);
});

export default defaultAxios;
