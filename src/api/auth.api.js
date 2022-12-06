import { get, post } from '_axios/request';

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

export const refreshToken = (token) => {
	return post(AUTH.REFETCH_TOKEN, { refresh_token: token });
};
