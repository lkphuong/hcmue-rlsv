import { get } from '_axios/request';

import { STATUSES } from './url';

export const getStatuses = () => {
	return get(STATUSES.GET_STUDENT_STATUSES);
};
