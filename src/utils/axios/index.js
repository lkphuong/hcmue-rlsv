import axios from 'axios';

import { Navigate } from 'react-router-dom';

import { logout, profile } from '_api/auth.api';

import { isSuccess } from '_func/';

import { store } from '_store';

import { actions } from '_slices/auth.slice';
import { updateAbility } from '_func/permissions';

const apiInstance = axios.create({
	// baseURL: process.env.REACT_APP_API_URL,
	baseURL: 'http://103.154.176.80:3020/api/',
	// baseURL: 'http://hcmue-ctcthssv.vtcode.vn:9093/api/',
	// baseURL: 'http://192.168.1.25:5099/api/',
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
		// if (error?.message === 'canceled') return;

		if (error?.response?.status === 401) {
			store.dispatch(actions.setProfile(null));
			store.dispatch(actions.setToken(null));

			window.localStorage.removeItem('access_token');
			window.localStorage.removeItem('refresh_token');

			return <Navigate to='/login' replace={true} />;
		}

		if (error?.response?.status === 403) {
			console.log('Thiếu quyền truy cập');

			return Promise.reject({
				...error.response.data,
				status: error.response.status,
			});
		}

		return Promise.reject({
			...error.response?.data,
			status: error.response?.status,
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

		if (isSuccess(res)) {
			const role_id = res?.data?.role;

			// Test roleId
			// const role_id = 3;

			updateAbility(role_id);
			store.dispatch(actions.setProfile({ ...res.data, role_id }));
		}

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
