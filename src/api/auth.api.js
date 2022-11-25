import { get, post } from '_axios/request';

import { AUTH } from './url';

export const profile = async () => {
	return await get(AUTH.PROFILE);
};

export const login = async (body) => {
	return await post(AUTH.LOGIN, body);
};

export const logout = async () => {
	return await get(AUTH.LOGOUT);
};
