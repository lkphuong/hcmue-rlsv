import { post } from '_axios/request';

import { USERS } from './url';

export const getStudentsRole = (body = {}) => {
	return post(USERS.GET_STUDENT, body);
};
