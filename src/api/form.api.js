import { get } from '_axios/request';

import { FORMS } from './url';

export const getHeadersByFormId = async (id) => {
	return await get(`${FORMS.GET_HEADERS_BY_FORM_ID}/${id}`);
};

export const getTitlesByHeaderId = async (id) => {
	return await get(`${FORMS.GET_TITLES_BY_HEADER_ID}/${id}`);
};

export const getItemsByTitleId = async (id) => {
	return await get(`${FORMS.GET_ITEMS_BY_TITLE_ID}/${id}`);
};
