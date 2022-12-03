import { get, post, remove } from '_axios/request';

import { OPTIONS } from './url';

export const getAcademicYears = () => {
	return get(OPTIONS.GET_ACADEMIC_YEARS);
};

export const createAcademicYear = (body) => {
	return post(OPTIONS.CREATE_ACADEMIC_YEARS, body);
};

export const removeAcademicYear = (id) => {
	return remove(`${OPTIONS.DELETE_ACADEMIC_YEARS}/${id}`);
};

export const getSemesters = () => {
	return get(OPTIONS.GET_SEMESTERS);
};

export const createSemester = (body) => {
	return post(OPTIONS.CREATE_SEMESTERS, body);
};

export const removeSemester = (id) => {
	return remove(`${OPTIONS.DELETE_SEMESTERS}/${id}`);
};
