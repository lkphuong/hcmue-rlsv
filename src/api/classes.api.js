import { post } from '_axios/request';

import { CLASSES } from './url';

export const getClasses = (body) => {
	return post(CLASSES.GET_CLASSES, body);
};
