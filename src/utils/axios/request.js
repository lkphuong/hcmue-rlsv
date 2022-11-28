import { alert } from '_func/alert';

import apiInstance from '.';

export const controller = null;

export const get = async (url, options = {}) => {
	// if (controller) {
	// 	controller.abort();
	// }

	// controller = new AbortController();

	try {
		return await apiInstance.get(url, {
			...options,
			// signal: controller.signal,
		});
	} catch (error) {
		return error;
	}
};

export const post = async (url, body, options = {}) => {
	// if (controller) {
	// 	controller.abort();
	// }

	// controller = new AbortController();

	alert.loading();
	try {
		return await apiInstance.post(url, body, {
			...options,
			// signal: controller.signal,
		});
	} catch (error) {
		return error;
	}
};

export const put = async (url, body, options = {}) => {
	// if (controller) {
	// 	controller.abort();
	// }

	// controller = new AbortController();

	alert.loading();
	try {
		return await apiInstance.put(url, body, {
			...options,
			// signal: controller.signal,
		});
	} catch (error) {
		return error;
	}
};

export const remove = async (url, options = {}) => {
	// if (controller) {
	// 	controller.abort();
	// }

	// controller = new AbortController();

	try {
		return await apiInstance.delete(url, {
			...options,
			// signal: controller.signal,
		});
	} catch (error) {
		return error;
	}
};
