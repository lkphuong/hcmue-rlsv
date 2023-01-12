import * as yup from 'yup';

export const initialValues = {
	department_id: null,
	username: '',
	password: '',
	confirm_password: '',
	isEdit: false,
};

export const validationSchema = yup.object().shape({
	isEdit: yup.boolean(),
	department_id: yup.number('Vui lòng chọn khoa.').required('Vui lòng chọn khoa.'),
	username: yup
		.string('Vui lòng nhập username.')
		.email('Tên đăng nhập phải định dạng email.')
		.required('Vui lòng nhập username.'),
	password: yup.string('Vui lòng nhập mật khẩu.').required('Vui lòng nhập mật khẩu.'),
	confirm_password: yup
		.string('Vui lòng nhập lại mật khẩu trên.')
		.oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
		.required('Vui lòng nhập lại mật khẩu trên.'),
});

export const validationSchemaEdit = yup.object().shape({
	username: yup
		.string('Vui lòng nhập username.')
		.email('Tên đăng nhập phải định dạng email.')
		.required('Vui lòng nhập username.'),
});
