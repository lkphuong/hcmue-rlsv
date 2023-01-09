import * as yup from 'yup';

//#region Initial Values
export const initialValues = {
	username: '',
	password: '',
	type: 1,
};
//#endregion

//#region Validation
export const validationSchema = yup.object({
	username: yup
		.string('Vui lòng nhập username(MSSV).')
		.max(255, 'Username tối đa 255 kí tự.')
		.required('Vui lòng nhập username(MSSV).'),
	password: yup
		.string('Vui lòng nhập password.')
		.max(255, 'Password tối đa 255 kí tự.')
		.required('Vui lòng nhập password.'),
	type: yup.number().required(),
});
//#endregion
