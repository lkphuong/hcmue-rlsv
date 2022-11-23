import { get, post, put } from '_axios/request';

import { SHEETS } from './url';

export const getSheetById = async (id) => {
	return await get(`${SHEETS.GET_BY_ID}/${id}`);
};

export const getMarks = async (id, title_id) => {
	return await get(`${SHEETS.GET_MARK}/${id}/items/${title_id}`);
};

export const getStudentSheets = async (id) => {
	return await get(`${SHEETS.SHEETS_GET_BY_STUDENT_ID}/${id}`);
};

export const updateStudentSheets = async (id, body = { role_id: 0, data: [] }) => {
	return await put(`${SHEETS.UPDATE_STUDENT_SHEET}/${id}`, body);
};

export const getClassSheets = async (id, params = { semester_id: 0, academic_id: 0 }) => {
	return await post(`${SHEETS.SHEETS_GET_BY_CLASS_ID}/${id}`, params);
};

export const updateClassSheets = async (id, body = { role_id: 0, data: [] }) => {
	return await put(`${SHEETS.UPDATE_CLASS_SHEET}/${id}`, body);
};

export const getDepartmentSheets = async (id, params = { semester_id: 0, academic_id: 0 }) => {
	return await post(`${SHEETS.SHEETS_GET_BY_DEPARTMENT_ID}/${id}`, params);
};

export const updateDepartmentSheets = async (id, body = { role_id: 0, data: [] }) => {
	return await put(`${SHEETS.UPDATE_DEPARTMENT_SHEET}/${id}`, body);
};
