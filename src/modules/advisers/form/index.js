import * as yup from 'yup';

const rules = (headers = []) => {
	const rule = {};

	headers.forEach((header) => {
		header.titles.forEach((title) => {
			title.items.forEach((item) => {
				if (rule[`title_${title.id}`]) {
					if (item.control === 2 && item.required)
						rule[`title_${title.id}`] = yup.array(
							yup.object({
								adviser_mark_level: yup
									.number('Vui lòng nhập điểm số')
									.typeError('Vui lòng nhập điểm số')
									.test('not-selected', 'Vui lòng chọn option', (value) => {
										if (!value) return false;
										return true;
									})
									.required('Vui lòng nhập điểm số'),
							})
						);
					else
						rule[`title_${title.id}`] = yup.array(
							yup.object({
								adviser_mark_level: yup
									.number('Vui lòng nhập điểm số')
									.typeError('Vui lòng nhập điểm số')
									.required('Vui lòng nhập điểm số'),
							})
						);
				} else {
					if (item.control === 2 && item.required)
						rule[`title_${title.id}`] = yup.array(
							yup.object({
								adviser_mark_level: yup
									.number('Vui lòng nhập điểm số')
									.typeError('Vui lòng nhập điểm số')
									.test('not-selected', 'Vui lòng chọn option', (value) => {
										if (!value) return false;
										return true;
									})
									.required('Vui lòng nhập điểm số'),
							})
						);
					else
						rule[`title_${title.id}`] = yup.array(
							yup.object({
								adviser_mark_level: yup
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
