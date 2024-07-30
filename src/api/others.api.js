import { post, put, remove } from '_axios/request';

import { OTHERS } from './url';

export const createDepartmentAccount = (body) => {
	return post(OTHERS.CREATE_DEPARTMENT_ACCOUNT, body);
};

export const updateDepartmentAccount = (id, body) => {
	return put(`${OTHERS.UPDATE_DEPARTMENT_ACCOUNT}/${id}`, body);
};

export const deleteDepartmentAccount = (id) => {
	return remove(`${OTHERS.DELETE_DEPARTMENT_ACCOUNT}/${id}`);
};

export const getDepartmentAccounts = (body) => {
	return post(OTHERS.GET_DEPARTMENT_ACCOUNTS, body);
};
