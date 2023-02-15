import { post } from '_axios/request';

import { REPORTS } from './url';

export const getReports = (body) => {
	return post(REPORTS.GET_REPORTS, body);
};

export const getClassReports = (body) => {
	return post(REPORTS.GET_CLASS_REPORTS, body);
};

export const adminExportWord = (body) => {
	return post(REPORTS.ADMIN_WORD, body, { responseType: 'blob' });
};

export const adminExportExcel = (body) => {
	return post(REPORTS.ADMIN_EXCEL, body, { responseType: 'blob' });
};

export const departmentExportWord = (body) => {
	return post(REPORTS.DEPARTMENT_WORD, body, { responseType: 'blob' });
};

export const departmentExportExcel = (body) => {
	return post(REPORTS.DEPARTMENT_EXCEL, body, { responseType: 'blob' });
};

export const classExportWord = (body) => {
	return post(REPORTS.CLASS_WORD, body, { responseType: 'blob' });
};

export const classExportExcel = (body) => {
	return post(REPORTS.CLASS_EXCEL, body, { responseType: 'blob' });
};
