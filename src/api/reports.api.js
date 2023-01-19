import { post } from '_axios/request';

import { REPORTS } from './url';

export const getReports = (body) => {
	return post(REPORTS.GET_REPORTS, body);
};

export const getClassReports = (body) => {
	return post(REPORTS.GET_CLASS_REPORTS, body);
};
