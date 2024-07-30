export const FORM_BY_ID = {
	id: 123,
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

export const ITEMS_DEMO_2 = [
	{
		id: 1,
		control: 0,
		multiple: false,
		content:
			'Tham gia các hoạt động học thuật: Hội thảo, tọa đàm, lớp hướng dẫn NCKH, hoạt động khảo sát của Trường…',
		from_mark: 3,
		to_mark: 0,
		category: 0,
		unit: 'Điểm/hoạt động',
		required: false,
		options: [],
	},
	{
		id: 2,
		control: 0,
		multiple: false,
		content:
			'Tham gia hoạt động NCKH: Có bài báo khoa học, tham luận được đăng tải trên các tạp chí, tạp san uy tín được công nhận; thực hiện đề tài NCKH, bài viết, bài tham luận tại các hội thảo khoa học…',
		from_mark: 5,
		to_mark: 0,
		category: 0,
		unit: 'Điểm/nghiên cứu',
		required: false,
		options: [],
	},
];

export const ITEMS_DEMO_3 = [
	{
		id: 1,
		control: 0,
		multiple: false,
		content: 'Tham gia cổ vũ các kỳ thi, cuộc thi học thuật',
		from_mark: 1,
		to_mark: 0,
		category: 0,
		unit: 'Điểm/hoạt động',
		required: false,
		options: [],
	},
];

export const ITEMS_DEMO_4 = [
	{
		id: 1,
		control: 2,
		multiple: false,
		content: 'Kết quả học tập của học kỳ đạt',
		from_mark: 0,
		to_mark: 10,
		category: 0,
		unit: 'Điểm',
		required: false,
		options: [],
	},
];
