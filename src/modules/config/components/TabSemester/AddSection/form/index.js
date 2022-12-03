import * as yup from 'yup';

export const validationSchema = yup.object({
	name: yup.string('Vui lòng nhập tên học kỳ.').required('Vui lòng nhập tên học kỳ.'),
});

export const initialValues = {
	name: '',
};
