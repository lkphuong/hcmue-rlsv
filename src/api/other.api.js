import { post, put, remove } from '_axios/request';

import { OTHER } from './url';

export const createDepartmentAccount = (body) => {
	return post(OTHER.CREATE_DEPARTMENT_ACCOUNT, body);
};

export const updateDepartmentAccount = (id, body) => {
	return put(`${OTHER.UPDATE_DEPARTMENT_ACCOUNT}/${id}`, body);
};

export const deleteDepartmentAccount = (id) => {
	return remove(`${OTHER.DELETE_DEPARTMENT_ACCOUNT}/${id}`);
};
