import { post } from '_axios/request';

import { USERS } from './url';

export const getStudentsRole = (body = {}) => {
	return post(USERS.GET_STUDENTS, body);
};

export const importUsers = (body) => {
	return post(USERS.IMPORT_STUDENTS, body);
};
