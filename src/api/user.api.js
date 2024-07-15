import { post, put } from '_axios/request';

import { USERS } from './url';

export const getStudentsRole = (body = {}) => {
	return post(USERS.GET_STUDENTS, body);
};

export const importUsers = (body) => {
	return post(USERS.IMPORT_STUDENTS, body);
};

export const updateStatusUser = (id, body) => {
	return put(`${USERS.UPDATE_STATUS}/${id}`, body);
};
