import * as yup from 'yup';

import { validateMark } from '_func/';

const rules = (headers = []) => {
	const rule = {};

	headers.forEach((header) => {
		header.titles.forEach((title) => {
			title.items.forEach((item) => {
				rule[`title_${title.id}_${item.id}`] = yup.object().shape({
					department_mark_level: yup
						.number()
						.test('custom', 'Điểm số không hợp lệ', (value) => {
							const isValid = validateMark(item, value);

							return isValid;
						}),
				});
			});
		});
	});

	return rule;
};

export const validationSchemaForm = (headers) => {
	return yup.object(rules(headers));
};
