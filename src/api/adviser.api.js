import { post } from '_axios/request';

import { ADVISER } from './url';

export const importAdvisers = (body) => {
	return post(ADVISER.IMPORT_ADVISERS, body);
};

export const getAllAdvisers = (body) => {
	return post(ADVISER.GET_ADVISERS, body);
};
