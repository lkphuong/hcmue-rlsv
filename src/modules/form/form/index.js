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
//#endregion
