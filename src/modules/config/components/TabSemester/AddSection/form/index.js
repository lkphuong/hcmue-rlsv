import * as yup from 'yup';

import dayjs from 'dayjs';

export const validationSchema = yup.object({
	name: yup.string().required(),
	academic_id: yup.number().required(),
	start: yup
		.date('Vui lòng chọn thời gian bắt đầu')
		.nullable()
		.typeError('Định dạng không hợp lệ (mm/yyyy).')
		.required('Vui lòng chọn thời gian bắt đầu')
		.test('wrong', 'Thời gian bắt đầu phải trước khi kết thúc', (value, context) => {
			const { parent } = context;

			if (dayjs(value).isAfter(parent.end)) return false;
			return true;
		}),
	end: yup
		.date('Vui lòng chọn thời gian kết thúc.')
		.nullable()
		.typeError('Định dạng không hợp lệ (mm/yyyy).')
		.required('Vui lòng chọn thời gian kết thúc.')
		.test('wrong', 'Thời gian kết thúc phải sau bắt đầu.', (value, context) => {
			const { parent } = context;

			if (dayjs(value).isBefore(parent.start)) return false;
			return true;
		}),
});

export const initialValues = {
	name: 'Học kỳ I',
	academic_id: null,
	start: null,
	end: null,
};
