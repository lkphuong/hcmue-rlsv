import { get, post, remove } from '_axios/request';

import { FORMS } from './url';

export const getForms = async () => {
	return await get(FORMS.GET_FORMS);
};

export const createForm = async (body = {}) => {
	return await post(FORMS.CREATE_FORM, body);
};

export const createHeader = async (body = {}) => {
	return await post(FORMS.CREATE_HEADER, body);
};

export const createTitle = async (body = {}) => {
	return await post(FORMS.CREATE_TITLE, body);
};

export const createItem = async (body = {}) => {
	return await post(FORMS.CREATE_ITEM, body);
};

export const getHeadersByFormId = async (id) => {
	return await get(`${FORMS.GET_HEADERS_BY_FORM_ID}/${id}`);
};

export const getTitlesByHeaderId = async (id) => {
	return await get(`${FORMS.GET_TITLES_BY_HEADER_ID}/${id}`);
};

export const getItemsByTitleId = async (id) => {
	return await get(`${FORMS.GET_ITEMS_BY_TITLE_ID}/${id}`);
};

export const deleteForm = async (id) => {
	return await remove(`${FORMS.DELETE_FORM}/${id}`);
};

export const deleteHeader = async (form_id, header_id) => {
	return await remove(`${FORMS.DELETE_HEADER}/${form_id}/headers/${header_id}`);
};

export const deleteTitle = async (form_id, title_id) => {
	return await remove(`${FORMS.DELETE_TITLE}/${form_id}/titles/${title_id}`);
};

export const deleteItem = async (form_id, item_id) => {
	return await remove(`${FORMS.DELETE_ITEM}/${form_id}/items/${item_id}`);
};
