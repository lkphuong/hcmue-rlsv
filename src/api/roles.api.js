import { post, put } from '_axios/request';

import { ROLES } from './url';

export const getStudentsRole = (body = {}) => {
	return post(ROLES.GET_STUDENT, body);
};

export const updateRole = (id, body = {}) => {
	return put(`${ROLES.UPDATE_ROLE}/${id}`, body);
};
