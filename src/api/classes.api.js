import { get } from '_axios/request';

import { CLASSES } from './url';

export const getClasses = (department_id) => {
	return get(`${CLASSES.GET_CLASSES}/${department_id}`);
};
