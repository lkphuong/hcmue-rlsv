import dayjs from 'dayjs';
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
	required: false,
	from_mark: 0,
	to_mark: 1,
	mark: 0,
	category: 0,
	unit: 'Điểm',
	options: [],
	is_file: false,
};
//#endregion

const MIN_DATE = dayjs();
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
				.date('Định dạng ngày không hợp lệ.')
				.min(MIN_DATE, 'Không thể chọn ngày quá khứ và hôm nay.')
				.typeError('Định dạng ngày không hợp lệ.')
				.nullable()
				.test('wrong', 'Ngày bắt đầu phải trước kết thúc.', (value, context) => {
					const { parent } = context;

					if (dayjs(value).isAfter(parent.end) || dayjs(value).isSame(parent.end, 'date'))
						return false;

					return true;
				})
				.required('Chọn ngày sinh viên bắt đầu chấm điểm.'),
			end: yup
				.date('Định dạng ngày không hợp lệ.')
				.min(MIN_DATE, 'Không thể chọn ngày quá khứ và hôm nay.')
				.typeError('Định dạng ngày không hợp lệ.')
				.nullable()
				.test('wrong', 'Ngày kết thúc phải sau bắt đầu.', (value, context) => {
					const { parent } = context;

					if (
						dayjs(value).isBefore(parent.start) ||
						dayjs(value).isSame(parent.start, 'date')
					)
						return false;

					return true;
				})
				.required('Chọn ngày sinh viên kết thúc chấm điểm.'),
		})
		.required('Vui lòng chọn thời gian sinh viên chấm điểm.'),
	classes: yup
		.object()
		.shape({
			start: yup
				.date('Định dạng ngày không hợp lệ.')
				.min(MIN_DATE, 'Không thể chọn ngày quá khứ và hôm nay.')
				.typeError('Định dạng ngày không hợp lệ.')
				.nullable()
				.test('wrong', 'Ngày bắt đầu phải trước kết thúc.', (value, context) => {
					const { parent } = context;

					if (dayjs(value).isAfter(parent.end) || dayjs(value).isSame(parent.end, 'date'))
						return false;

					return true;
				})
				.required('Chọn ngày lớp bắt đầu chấm điểm.'),
			end: yup
				.date('Định dạng ngày không hợp lệ.')
				.min(MIN_DATE, 'Không thể chọn ngày quá khứ và hôm nay.')
				.typeError('Định dạng ngày không hợp lệ.')
				.nullable()
				.test('wrong', 'Ngày kết thúc phải sau bắt đầu.', (value, context) => {
					const { parent } = context;

					if (
						dayjs(value).isBefore(parent.start) ||
						dayjs(value).isSame(parent.start, 'date')
					)
						return false;

					return true;
				})
				.required('Chọn ngày lớp kết thúc chấm điểm.'),
		})
		.required('Vui lòng chọn thời gian lớp chấm điểm.'),
	department: yup
		.object()
		.shape({
			start: yup
				.date('Định dạng ngày không hợp lệ.')
				.min(MIN_DATE, 'Không thể chọn ngày quá khứ và hôm nay.')
				.typeError('Định dạng ngày không hợp lệ.')
				.nullable()
				.test('wrong', 'Ngày bắt đầu phải trước kết thúc.', (value, context) => {
					const { parent } = context;

					if (dayjs(value).isAfter(parent.end) || dayjs(value).isSame(parent.end, 'date'))
						return false;

					return true;
				})
				.required('Chọn ngày khoa bắt đầu chấm điểm.'),
			end: yup
				.date('Định dạng ngày không hợp lệ.')
				.min(MIN_DATE, 'Không thể chọn ngày quá khứ và hôm nay.')
				.typeError('Định dạng ngày không hợp lệ.')
				.nullable()
				.test('wrong', 'Ngày kết thúc phải sau bắt đầu.', (value, context) => {
					const { parent } = context;

					if (
						dayjs(value).isBefore(parent.start) ||
						dayjs(value).isSame(parent.start, 'date')
					)
						return false;

					return true;
				})
				.required('Chọn ngày khoa kết thúc chấm điểm.'),
		})
		.required('Vui lòng chọn thời gian khoa chấm điểm.'),
});

export const validationHeader = yup.object({
	name: yup.string('Vui lòng nhập tên danh mục.').required('Vui lòng nhập tên danh mục.'),
	max_mark: yup
		.number('Vui lòng nhập điểm tối đa')
		.moreThan(0, 'Điểm tối đa phải lớn hơn 0.')
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
	category: yup.number().typeError(),
	from_mark: yup
		.number('Giá trị điểm tối thiểu phải là số.')
		.typeError('Giá trị điểm tối thiểu phải là số.')
		.notRequired()
		.when('category', {
			is: (value) => value === 1,
			then: yup
				.number('Giá trị điểm tối thiểu phải là số.')
				.typeError('Giá trị điểm tối thiểu phải là số.')
				.required('Vui lòng nhập điểm tối thiểu.')
				.test('is-more', 'Điểm tối thiểu phải nhỏ hơn tối đa.', (value, context) => {
					const { parent } = context;

					if (value > parent.to_mark) return false;

					return true;
				}),
		}),
	to_mark: yup
		.number('Giá trị điểm tối đa phải là số.')
		.typeError('Giá trị điểm tối đa phải là số.')
		.notRequired()
		.when('category', {
			is: (value) => value === 1,
			then: yup
				.number('Giá trị điểm tối đa phải là số.')
				.typeError('Giá trị điểm tối đa phải là số.')
				.required('Vui lòng nhập điểm tối đa.')
				.test('is-less', 'Điểm tối đa phải lớn hơn tối thiểu.', (value, context) => {
					const { parent } = context;

					if (value < parent.from_mark) return false;

					return true;
				}),
		}),
	mark: yup
		.number('Giá trị điểm tối đa phải là số.')
		.typeError('Giá trị điểm tối đa phải là số.')
		.notRequired()
		.when('category', {
			is: (value) => value !== 1,
			then: yup.number().when('control', {
				is: (value) => value !== 2,
				then: yup
					.number('Giá trị điểm tối đa phải là số.')
					.moreThan(0, 'Giá trị điểm phải lớn hơn 0.')
					.typeError('Giá trị điểm tối đa phải là số.')
					.required('Vui lòng nhập điểm tối đa.'),
			}),
		}),
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
						.typeError('Giá trị điểm của tiêu chí phải là số.')
						.test('is-zero', 'Giá trị điểm phải khác 0.', (value) => {
							if (value?.toString() === '0') return false;
							return true;
						})
						.required('Vui lòng nhập điểm cho tiêu chí.'),
				})
			)
			.min(1, 'Phải có ít nhất 1 tùy chọn cho control Select/Multiple select'),
	}),
});
//#endregion
