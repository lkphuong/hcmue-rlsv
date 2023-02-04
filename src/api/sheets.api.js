import { get, post, put } from '_axios/request';

import { SHEETS } from './url';

export const getSheetById = (id) => {
	return get(`${SHEETS.GET_BY_ID}/${id}`);
};

export const getDetailSheet = (id) => {
	return get(`${SHEETS.GET_DETAIL_SHEET}/${id}`);
};

export const getMarks = (id, title_id) => {
	return get(`${SHEETS.GET_MARK}/${id}/items/${title_id}`);
};

export const getItemsMarks = (sheet_id) => {
	return get(`${SHEETS.GET_ITEMS_MARK}/${sheet_id}`);
};

export const getCurrentStudentSheet = (std_code) => {
	return get(`${SHEETS.GET_BY_STD_CODE}/${std_code}`);
};

export const getStudentHistorySheets = (body) => {
	return post(SHEETS.STUDENT_GET_HISTORY, body);
};

export const getCurrentClassSheet = (body) => {
	return post(SHEETS.GET_CURRENT_CLASS_SHEET, body);
};

export const getClassHistorySheets = (body) => {
	return post(SHEETS.CLASS_GET_HISTORY, body);
};

export const updateStudentSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_STUDENT_SHEET}/${id}`, body);
};

export const getClassSheets = (id, body = { semester_id: 0, academic_id: 0 }) => {
	return post(`${SHEETS.SHEETS_GET_BY_CLASS_ID}/${id}`, { status: -1, ...body });
};

export const updateClassSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_CLASS_SHEET}/${id}`, body);
};

export const updateAdviserSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_ADVISER_SHEET}/${id}`, body);
};

export const getDepartmentHistorySheets = (body) => {
	return post(SHEETS.DEPARTMENT_GET_HISTORY, body);
};

export const updateDepartmentSheets = (id, body = { role_id: 0, data: [] }) => {
	return put(`${SHEETS.UPDATE_DEPARTMENT_SHEET}/${id}`, body);
};

export const getDepartmentSheets = (body) => {
	return post(SHEETS.DEPARTMENT_GET_SHEETS, body);
};

export const getAdminSheets = (body) => {
	return post(SHEETS.ADMIN_GET_SHEETS, body);
};

export const getAdminClassSheetsByDepartment = (body) => {
	return post(SHEETS.ADMIN_GET_CLASS_SHEETS, body);
};

export const getAdminHistorySheets = (body) => {
	return post(SHEETS.ADMIN_GET_HISTORY, body);
};

export const approveAll = (body) => {
	return put(SHEETS.APPROVE_ALL, body);
};
