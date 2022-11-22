import { get } from '_axios/request';
import { OPTIONS } from './url';

export const getAcademicYears = async () => {
	return await get(OPTIONS.GET_ACADEMIC_YEARS);
};

export const getSemesters = async () => {
	return await get(OPTIONS.GET_SEMESTERS);
};
