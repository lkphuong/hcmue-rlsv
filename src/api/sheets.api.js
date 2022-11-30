import { get, post, put } from '_axios/request';

import { SHEETS } from './url';

export const getSheetById = (id) => {
	return get(`${SHEETS.GET_BY_ID}/${id}`);
};

export const getMarks = (id, title_id) => {
	return get(`${SHEETS.GET_MARK}/${id}/items/${title_id}`);
};

export const getItemsMarks = (sheet_id) => {
	return get(`${SHEETS.GET_ITEMS_MARK}/${sheet_id}`);
};

export const getStudentSheets = (id) => {
	return get(`${SHEETS.SHEETS_GET_BY_STUDENT_ID}/${id}`);
};

export const updateStudentSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_STUDENT_SHEET}/${id}`, body);
};

export const getClassSheets = (id, params = { semester_id: 0, academic_id: 0 }) => {
	return post(`${SHEETS.SHEETS_GET_BY_CLASS_ID}/${id}`, params);
};

export const updateClassSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_CLASS_SHEET}/${id}`, body);
};

export const getDepartmentSheets = (id, params = { semester_id: 0, academic_id: 0 }) => {
	return post(`${SHEETS.SHEETS_GET_BY_DEPARTMENT_ID}/${id}`, params);
};

export const updateDepartmentSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_DEPARTMENT_SHEET}/${id}`, body);
};
