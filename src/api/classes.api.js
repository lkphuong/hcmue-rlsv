import { get } from '_axios/request';

import { CLASSES } from './url';

export const getClasses = async (body = { department_id: '', academic_year_id: 0 }) => {
	return await get(`${CLASSES.GET_CLASSES}`, body);
};
