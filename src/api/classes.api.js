import { get } from '_axios/request';

import { CLASSES } from './url';

export const getClassesByDepartment = (department_id) => {
	return get(`${CLASSES.GET_CLASSES_BY_DEPARTMENT_ID}/${department_id}`);
};
