import { get, post } from '_axios/request';

import { SHEETS } from './url';

export const getSheetById = async (id) => {
	return await get(`${SHEETS.GET_BY_ID}/${id}`);
};

export const getStudentSheets = async (id) => {
	return await get(`${SHEETS.SHEETS_GET_BY_STUDENT_ID}/${id}`);
};

export const getClassSheets = async (id, params = { semester_id: 0, academic_id: 0 }) => {
	return await post(`${SHEETS.SHEETS_GET_BY_CLASS_ID}/${id}`, params);
};

export const getDepartmentSheets = async (id, params = { semester_id: 0, academic_id: 0 }) => {
	return await post(`${SHEETS.SHEETS_GET_BY_DEPARTMENT_ID}/${id}`, params);
};
