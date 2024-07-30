import dayjs from 'dayjs';
import * as yup from 'yup';

export const validationSchema = yup.object({
	from: yup.date().typeError().required(),
	to: yup.date().typeError().required(),
});

export const initialValues = {
	from: dayjs(),
	to: dayjs().add(1, 'year'),
};
