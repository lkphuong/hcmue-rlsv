import { put } from '_axios/request';

import { ROLES } from './url';

export const updateRole = (id, body = {}) => {
	return put(`${ROLES.UPDATE_ROLE}/${id}`, body);
};
