import axios from 'axios';

import { Navigate } from 'react-router-dom';

import { logout, profile } from '_api/auth.api';

import { isSuccess } from '_func/';

import { store } from 'src/store';

import { actions } from 'src/store/slices/auth.slice';

const apiInstance = axios.create({
	// baseURL: process.env.REACT_APP_API_URL,
	baseURL: 'http://192.168.1.25:5031/api/',
	timeout: process.env.REACT_APP_API_TIMEOUT,
});

apiInstance.interceptors.request.use(
	(config) => config,
	(error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
	(response) => {
		if (response.status === 205) return console.log('Refetch');

		if (response.data instanceof Blob) return { data: response.data, status: response.status };

		return { ...response.data, status: response.status };
	},
	(error) => {
		if (error?.constructor?.name === 'Cancel') {
			return error?.message ?? 'Cancel';
		}

		if (error?.response?.status === 401) {
			store.dispatch(actions.setProfile(null));
			store.dispatch(actions.setToken(null));
		}

		if (error?.response?.status === 403) {
			console.log('Thiếu quyền truy cập');

			return Promise.reject({
				...error.response.data,
				status: error.response.status,
			});
		}

		return Promise.reject({
			...error.response.data,
			status: error.response.status,
		});
	}
);

export const setAuthToken = (token) => {
	if (token) {
		apiInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
	} else {
		delete apiInstance.defaults.headers.common['Authorization'];
	}
};

export const getProfile = async (token) => {
	try {
		setAuthToken(token);

		const res = await profile();

		if (isSuccess(res)) store.dispatch(actions.setProfile(res.data));

		return res;
	} catch (error) {
		tryLogout();
	}
};

export const tryLogout = async () => {
	await logout();

	store.dispatch(actions.setProfile(null));
	store.dispatch(actions.setToken(null));

	window.localStorage.removeItem('access_token');
	window.localStorage.removeItem('refresh_token');

	return <Navigate to='/login' replace={true} />;
};

export default apiInstance;
