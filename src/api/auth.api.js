import { get, post, put } from '_axios/request';

import { AUTH } from './url';

export const profile = () => {
	return get(AUTH.PROFILE);
};

export const login = (body) => {
	return post(AUTH.LOGIN, body);
};

export const logout = () => {
	return get(AUTH.LOGOUT);
};

export const refreshToken = (refresh_token) => {
	return post(AUTH.REFETCH_TOKEN, refresh_token);
};

export const changePassword = (body) => {
	return post(AUTH.CHANGE_PASSWORD, body);
};

export const restorePassword = (id, body) => {
	return put(`${AUTH.RESTORE_PASSWORD}/${id}`, body);
};

export const forgotPassword = (body) => {
	return post(`${AUTH.FORGOT_PASSWORD}`, body);
};

export const resetPassword = (body) => {
	return post(`${AUTH.RESET_PASSWORD}`, body);
};
