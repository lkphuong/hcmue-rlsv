import { get } from '_axios/request';
import { OPTIONS } from './url';

export const getAcademicYears = () => {
	return get(OPTIONS.GET_ACADEMIC_YEARS);
};

export const getSemesters = () => {
	return get(OPTIONS.GET_SEMESTERS);
};
