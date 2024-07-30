import { get, post, remove } from '_axios/request';

import { DEPARTMENTS, OPTIONS } from './url';

export const getAcademicYears = () => {
	return get(OPTIONS.GET_ACADEMIC_YEARS);
};

export const createAcademicYear = (body) => {
	return post(OPTIONS.CREATE_ACADEMIC_YEARS, body);
};

export const removeAcademicYear = (id) => {
	return remove(`${OPTIONS.DELETE_ACADEMIC_YEARS}/${id}`);
};

export const getSemesters = (body) => {
	return post(OPTIONS.GET_ALL_SEMESTERS, body);
};

export const createSemester = (body) => {
	return post(OPTIONS.CREATE_SEMESTERS, body);
};

export const removeSemester = (id) => {
	return remove(`${OPTIONS.DELETE_SEMESTERS}/${id}`);
};

export const getAllDepartments = () => {
	return get(DEPARTMENTS.GET_ALL);
};

export const getSemestersByYear = (academic_id) => {
	return get(`${OPTIONS.GET_SEMESTERS_BY_YEAR}/${academic_id}`);
};
