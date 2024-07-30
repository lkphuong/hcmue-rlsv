export const STUDENTS = [
	{
		id: 123,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 0,
		level: {
			id: 1,
			name: 'Khá',
		},
		status: 1,
	},
	{
		id: 223,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 75,
		level: {
			id: 2,
			name: 'Giỏi',
		},
		status: 4,
	},
	{
		id: 234,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 100,
		level: {
			id: 3,
			name: 'Yếu',
		},
		status: 3,
	},
	{
		id: 6365,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 60,
		level: {
			id: 1,
			name: 'Khá',
		},
		status: 4,
	},
	{
		id: 473,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 47,
		level: {
			id: 6,
			name: 'Kém',
		},
		status: 3,
	},
	{
		id: 1225323,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 84,
		level: {
			id: 2,
			name: 'Giỏi',
		},
		status: 2,
	},
	{
		id: 2622,
		user: {
			fullname: 'Đặng Hoàng Phúc',
		},
		code: '41.01.104.094',
		total: 85,
		level: {
			id: 5,
			name: 'Trung bình',
		},
		status: 2,
	},
];
export const FORM_BY_ID = {
	id: 123,
	user: {
		id: '123',
		fullname: 'Đặng Hoàng Phúc',
		std_code: '41.01.104.094',
	},
	class: {
		id: 123,
		class_name: 'CNTT.C',
	},
	semester: {
		id: 123,
		name: 'Học kỳ 2',
	},
	academic: {
		id: 123,
		name: '2021-2022',
	},
	department: {
		id: 123,
		name: 'CNTT',
	},
};

export const HEADERS = [
	{
		id: 1,
		name: 'Đánh giá về ý thức tham gia học tập',
	},
	// {
	// 	id: 2,
	// 	name: 'Đánh giá về ý thức chấp hành nội quy, quy chế, quy định trong trường',
	// },
	// {
	// 	id: 3,
	// 	name: 'Đánh giá về ý thức tham gia các hoạt động chính trị, xã hội, văn hóa, văn nghệ, thể thao, phòng chống tội phạm và các tệ nạn xã hội',
	// },
	// {
	// 	id: 4,
	// 	name: 'Đánh giá về ý thức công dân trong quan hệ cộng đồng',
	// },
	// {
	// 	id: 5,
	// 	name: 'Đánh giá về ý thức và kết quả tham gia công tác phụ trách lớp, các đoàn thể, tổ chức trong trường; đạt thành tích xuất sắc trong học tập, rèn luyện',
	// },
];

export const TITLES = [
	{
		id: 1,
		name: 'a. Tinh thần và thái độ trong học tập',
	},
	{
		id: 2,
		name: 'b. Tham gia các hoạt động học thuật, hoạt động nghiên cứu khoa học (NCKH)',
	},
	{
		id: 3,
		name: 'c. Tham gia các kỳ thi, cuộc thi',
	},
	// {
	// 	id: 4,
	// 	name: 'd. Kết quả học tập',
	// },
];

export const ITEMS_DEMO_1 = [
	{
		id: 123,
		control: 1,
		multiple: true,
		content: 'Vào lớp học đúng giờ, tham gia các giờ học đầy đủ',
		from_mark: 1.5,
		to_mark: 0,
		category: 0,
		unit: 'Điểm',
		required: false,
		options: [],
	},
	{
		id: 234,
		control: 1,
		multiple: true,
		content: 'Chuẩn bị bài tốt, ý thức trong giờ học nghiêm túc',
		from_mark: 1.5,
		to_mark: 0,
		category: 0,
		unit: 'Điểm',
		required: false,
		options: [],
	},
	{
		id: 345,
		control: 0,
		multiple: false,
		content: 'Tinh thần vượt khó, phấn đấu vươn lên trong học tập',
		from_mark: 0,
		to_mark: 3,
		category: 1,
		unit: 'Điểm',
		required: false,
		options: [],
	},
];

export const HOCKY = [
	{ id: 1, name: 'Học kỳ I' },
	{ id: 2, name: 'Học kỳ II' },
	{ id: 3, name: 'Học kỳ III' },
	{ id: 4, name: 'Học kỳ hè' },
];

export const NIENKHOA = [
	{ id: 2021, name: '2021-2022' },
	{ id: 2022, name: '2022-2023' },
	{ id: 2020, name: '2020-2021' },
	{ id: 2023, name: '2023-2024' },
];
