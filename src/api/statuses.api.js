import { get, put } from '_axios/request';

import { STATUSES } from './url';

export const getStatuses = () => {
	return get(STATUSES.GET_STUDENT_STATUSES);
};

export const updateStatus = (id, body) => {
	return put(`${STATUSES.UPDATE_STATUS}/${id}`, body);
};
