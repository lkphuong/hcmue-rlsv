import { get, post } from '_axios/request';

import { formatFileName } from '_func/';

import { FILES } from './url';

export const uploadFile = (file) => {
	if (file) {
		const { name, type } = file;

		const newFile = new File([file], formatFileName(name), { type });

		const payload = new FormData();

		payload.append('file', newFile);

		return post(FILES.UPLOAD, payload);
	}

	return;
};

export const getFileReports = (params) => {
	return get(FILES.GET_REPORTS, { params });
};
