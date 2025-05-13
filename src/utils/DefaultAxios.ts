import axios from "axios";

const defaultAxios = axios.create({
  // baseURL: process.env.REACT_APP_BASE_API,
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json',
  },
});

defaultAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

defaultAxios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response?.status === 401) {
    localStorage.removeItem('access_token');
	window.location.href = "/sign-in";
	return Promise.reject(error);	
  }

  if (error.response?.status === 422) {
    console.log(error.response);
    return Promise.reject(error);
  }

  if (error.response?.status === 500) {
    console.log(error.response);
    return Promise.reject(error);	
  }

  console.log(error);
  return Promise.reject(error);
});

export default defaultAxios;
