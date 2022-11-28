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
//#endregion
