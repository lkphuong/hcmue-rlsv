import { get } from '_axios/request';

import { SHEETS } from './url';

export const getSheetById = async (id) => {
	return await get(`${SHEETS.GET_BY_ID}/${id}`);
};

export const getStudentSheets = async (id) => {
	return await get(`${SHEETS.STUDENT_GET_BY_USER_ID}/${id}`);
};
