import * as yup from 'yup';

const rules = (headers = []) => {
	const rule = {};

	headers.forEach((header) => {
		header.titles.forEach((title) => {
			title.items.forEach((item) => {
				if (rule[`title_${title.id}`]) {
					rule[`title_${title.id}`] = yup.array(
						yup.object({
							department_mark_level: yup
								.number('Vui lòng nhập điểm số')
								.typeError('Vui lòng nhập điểm số')
								.required('Vui lòng nhập điểm số'),
						})
					);
				} else {
					rule[`title_${title.id}`] = yup.array(
						yup.object({
							department_mark_level: yup
								.number('Vui lòng nhập điểm số')
								.typeError('Vui lòng nhập điểm số')
								.required('Vui lòng nhập điểm số'),
						})
					);
				}
			});
		});
	});

	return rule;
};

export const validationSchema = (headers) => {
	return yup.object(rules(headers));
};
