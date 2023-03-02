import * as yup from 'yup';

import { validateMark } from '_func/';

const rules = (headers = []) => {
	const rule = {};

	headers.forEach((header) => {
		header.titles.forEach((title) => {
			title.items.forEach((item) => {
				rule[`title_${title.id}_${item.id}`] = yup.object().shape({
					personal_mark_level: yup
						.number()
						.test('custom', 'Điểm số không hợp lệ', (value) => {
							const isValid = validateMark(item, value);

							return isValid;
						}),
					files: yup
						.array()
						.nullable()
						.when('personal_mark_level', {
							is: (value) => value !== 0,
							then: yup
								.array()
								.nullable()
								.when('is_file', {
									is: true,
									then: yup
										.array()
										.min(1, 'Cần tối thiểu 1 file minh chứng')
										.required('Thiếu file minh chứng'),
								}),
						}),
				});
			});
		});
	});

	return rule;
};

export const validationSchema = (headers) => {
	return yup.object(rules(headers));
};
