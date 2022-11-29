import * as yup from 'yup';

//#region Initial Values
export const initialValues = {
	academic_id: null,
	semester_id: null,
	student: {
		start: null,
		end: null,
	},
	classes: {
		start: null,
		end: null,
	},
	department: {
		start: null,
		end: null,
	},
};

export const initialHeader = {
	name: '',
	max_mark: 0,
};

export const initialTitle = {
	name: '',
};

export const initialItem = {
	control: 0,
	content: '',
	required: true,
	from_mark: 0,
	to_mark: 0,
	category: 0,
	unit: 'Điểm',
	options: [{ content: '', mark: 0 }],
};
//#endregion

//#region Validation
export const validationSchema = yup.object({
	academic_id: yup
		.number('Vui lòng chọn niên khóa.')
		.nullable('Vui lòng chọn niên khóa.')
		.required('Vui lòng chọn niên khóa.'),
	semester_id: yup
		.number('Vui lòng chọn học kỳ.')
		.nullable('Vui lòng chọn học kỳ.')
		.required('Vui lòng chọn học kỳ.'),
	student: yup
		.object()
		.shape({
			start: yup
				.date('Vui lòng chọn thời gian sinh viên chấm điểm')
				.typeError('Vui lòng chọn thời gian sinh viên chấm điểm')
				.required('Vui lòng chọn thời gian sinh viên chấm điểm'),
			end: yup
				.date('Vui lòng chọn thời gian sinh viên chấm điểm')
				.typeError('Vui lòng chọn thời gian sinh viên chấm điểm')
				.required('Vui lòng chọn thời gian sinh viên chấm điểm'),
		})
		.required('Vui lòng chọn thời gian sinh viên chấm điểm'),
	classes: yup
		.object()
		.shape({
			start: yup
				.date('Vui lòng chọn thời gian lớp chấm điểm')
				.typeError('Vui lòng chọn thời gian lớp chấm điểm')
				.required('Vui lòng chọn thời gian lớp chấm điểm'),
			end: yup
				.date('Vui lòng chọn thời gian lớp chấm điểm')
				.typeError('Vui lòng chọn thời gian lớp chấm điểm')
				.required('Vui lòng chọn thời gian lớp chấm điểm'),
		})
		.required('Vui lòng chọn thời gian lớp chấm điểm'),
	department: yup
		.object()
		.shape({
			start: yup
				.date('Vui lòng chọn thời gian khoa chấm điểm')
				.typeError('Vui lòng chọn thời gian khoa chấm điểm')
				.required('Vui lòng chọn thời gian khoa chấm điểm'),
			end: yup
				.date('Vui lòng chọn thời gian khoa chấm điểm')
				.typeError('Vui lòng chọn thời gian khoa chấm điểm')
				.required('Vui lòng chọn thời gian khoa chấm điểm'),
		})
		.required('Vui lòng chọn thời gian khoa chấm điểm'),
});

export const validationHeader = yup.object({
	name: yup.string('Vui lòng nhập tên danh mục.').required('Vui lòng nhập tên danh mục.'),
	max_mark: yup
		.number('Vui lòng nhập điểm tối đa')
		.min(0, 'Điểm tối đa tối thiểu là 0.')
		.typeError('Điểm tối đa phải là số.')
		.required('Vui lòng nhập điểm tối đa'),
});

export const validationTitle = yup.object({
	name: yup
		.string('Vui lòng nhập tên tiêu chí đánh giá.')
		.required('Vui lòng nhập tên tiêu chí đánh giá.'),
});

export const validationItem = yup.object({
	control: yup.number().typeError().required(),
	content: yup
		.string('Vui lòng nhập nội dung tiêu chí.')
		.required('Vui lòng nhập nội dung tiêu chí.'),
	required: yup.bool(),
	from_mark: yup
		.number('Giá trị điểm tối thiểu phải là số.')
		.typeError('Giá trị điểm tối thiểu phải là số.')
		.required('Vui lòng nhập điểm cho tiêu chí.'),
	to_mark: yup
		.number('Giá trị điểm tối đa phải là số.')
		.typeError('Giá trị điểm tối đa phải là số.')
		.required('Vui lòng nhập điểm cho tiêu chí.'),
	category: yup.number().typeError(),
	options: yup.array().when('control', {
		is: (value) => value === 2 || value === 3,
		then: yup
			.array(
				yup.object({
					content: yup
						.string('Vui lòng nhập chi tiết tiêu chí.')
						.required('Vui lòng nhập chi tiết tiêu chí.'),
					mark: yup
						.number('Giá trị điểm của tiêu chí phải là số.')
						.min(1, 'Giá trị điểm của tùy chọn phải lớn hơn 0.')
						.typeError('Giá trị điểm của tiêu chí phải là số.')
						.required('Vui lòng nhập điểm cho tiêu chí.'),
				})
			)
			.min(1, 'Phải có ít nhất 1 tùy chọn cho control Select/Multiple select'),
	}),
});
//#endregion
