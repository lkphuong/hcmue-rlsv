import { get, post, put, remove } from '_axios/request';

import { FORMS } from './url';

export const getForms = (body) => {
	return post(FORMS.GET_FORMS, body);
};

export const createForm = (body = {}) => {
	return post(FORMS.CREATE_FORM, body);
};

export const updateForm = (id, body) => {
	return put(`${FORMS.UPDATE_FORM}/${id}`, body);
};

export const createHeader = (body = {}) => {
	return post(FORMS.CREATE_HEADER, body);
};

export const updateHeader = (id, body) => {
	return put(`${FORMS.UPDATE_HEADER}/${id}`, body);
};

export const createTitle = (body = {}) => {
	return post(FORMS.CREATE_TITLE, body);
};

export const updateTitle = (id, body) => {
	return put(`${FORMS.UPDATE_TITLE}/${id}`, body);
};

export const createItem = (body = {}) => {
	return post(FORMS.CREATE_ITEM, body);
};

export const updateItem = (id, body) => {
	return put(`${FORMS.UPDATE_ITEM}/${id}`, body);
};

export const getFormById = (id) => {
	return get(`${FORMS.GET_FORM_BY_ID}/${id}`);
};

export const getDetailForm = (id) => {
	return get(`${FORMS.GET_DETAIL_FORM}/${id}`);
};

export const getHeadersByFormId = (id) => {
	return get(`${FORMS.GET_HEADERS_BY_FORM_ID}/${id}`);
};

export const getTitlesByHeaderId = (id) => {
	return get(`${FORMS.GET_TITLES_BY_HEADER_ID}/${id}`);
};

export const getItemsByTitleId = (id) => {
	return get(`${FORMS.GET_ITEMS_BY_TITLE_ID}/${id}`);
};

export const deleteForm = (id) => {
	return remove(`${FORMS.DELETE_FORM}/${id}`);
};

export const deleteHeader = (form_id, header_id) => {
	return remove(`${FORMS.DELETE_HEADER}/${form_id}/headers/${header_id}`);
};

export const deleteTitle = (form_id, title_id) => {
	return remove(`${FORMS.DELETE_TITLE}/${form_id}/titles/${title_id}`);
};

export const deleteItem = (form_id, item_id) => {
	return remove(`${FORMS.DELETE_ITEM}/${form_id}/items/${item_id}`);
};

export const publishForm = (id) => {
	return put(`${FORMS.PUBLISH}/${id}`);
};

export const unpublishForm = (id) => {
	return put(`${FORMS.UNPUBLISH}/${id}`);
};

export const cloneForm = (id) => {
	return post(`${FORMS.CLONE}/${id}`);
};

export const publishFormNow = (id) => {
	return put(`${FORMS.PUBLISH_NOW}/${id}`);
};

export const unpublishFormNow = (id) => {
	return put(`${FORMS.UNPUBLISH_NOW}/${id}`);
};
