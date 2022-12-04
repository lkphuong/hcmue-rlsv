import { post } from '_axios/request';

import { REPORTS } from './url';

export const getRerorts = (body) => {
	return post(REPORTS.GET_REPORTS, body);
};
