import * as yup from 'yup';

//#region Initial Values
export const initialValues = {
	username: '',
	password: '',
	type: 1,
};

export const initialValuesChangePassword = {
	old_password: '',
	new_password: '',
	confirm_password: '',
};
//#endregion

//#region Validation
export const validationSchema = yup.object({
	username: yup
		.string('Vui lòng nhập username.')
		.max(255, 'Username tối đa 255 kí tự.')
		.required('Vui lòng nhập username.'),
	password: yup
		.string('Vui lòng nhập password.')
		.max(255, 'Password tối đa 255 kí tự.')
		.required('Vui lòng nhập password.'),
	type: yup.number().required(),
});

export const validationSchemaChangePassword = yup.object({
	old_password: yup
		.string('Vui lòng nhập mật khẩu hiện tại.')
		.required('Vui lòng nhập mật khẩu hiện tại.'),
	new_password: yup.string('Vui lòng nhập mật khẩu mới.').required('Vui lòng nhập mật khẩu mới.'),
	confirm_password: yup
		.string('Vui lòng nhập lại mật khẩu mới.')
		.required('Vui lòng nhập lại mật khẩu mới.')
		.oneOf([yup.ref('new_password'), null], 'Mật khẩu không khớp.'),
});

export const validationSchemaForgotPassword = yup.object({
	type: yup.number().required(),
	email: yup
		.string('Vui lòng nhập email.')
		.email('Email không hợp lệ.')
		.required('Vui lòng nhập email.'),
});

export const validationSchemaResetPassword = yup.object({
	new_password: yup.string('Vui lòng nhập mật khẩu mới.').required('Vui lòng nhập mật khẩu mới.'),
	confirm_password: yup
		.string('Vui lòng nhập xác nhận mật khẩu mới.')
		.required('Vui lòng nhập xác nhận mật khẩu mới.')
		.oneOf([yup.ref('new_password'), null], 'Mật khẩu không khớp.'),
	token: yup.string().required(),
});
//#endregion
