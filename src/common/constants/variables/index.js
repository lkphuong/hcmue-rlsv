export const TYPE_NUMBER = /^[0-9-]+$/;

export const LEVEL = [
	{ id: 0, value: 0, name: 'Không xếp loại' },
	{ id: 1, value: 1, name: 'Kém' },
	{ id: 2, value: 2, name: 'Yếu' },
	{ id: 3, value: 3, name: 'Trung bình' },
	{ id: 4, value: 4, name: 'Khá' },
	{ id: 5, value: 5, name: 'Tốt' },
	{ id: 6, value: 6, name: 'Xuất sắc' },
];

export const STATUS = [
	{ id: 0, value: 0, name: 'Chưa đánh giá' },
	{ id: 1, value: 1, name: 'Chờ lớp xét duyệt' },
	{ id: 2, value: 2, name: 'Lớp quá hạn duyệt' },
	{ id: 3, value: 3, name: 'Chờ khoa xét duyệt' },
	{ id: 4, value: 4, name: 'Khoa quá hạn duyệt' },
	{ id: 5, value: 5, name: 'Hoàn thành' },
];

export const FORM_STATUS = [
	{ id: 0, value: 0, name: 'Nháp' },
	{ id: 1, value: 1, name: 'Đã phát hành' },
	{ id: 2, value: 2, name: 'Đang xử lý' },
	{ id: 3, value: 3, name: 'Hoàn thành' },
];

export const HOCKY = [
	{ id: 1, name: 'Học kỳ I' },
	{ id: 2, name: 'Học kỳ II' },
	{ id: 3, name: 'Học kỳ III' },
	{ id: 4, name: 'Học kỳ hè' },
];

export const NIENKHOA = [
	{ id: 1, name: '2021-2022' },
	{ id: 2, name: '2022-2023' },
	{ id: 3, name: '2020-2021' },
	{ id: 4, name: '2023-2024' },
];

export const CONTROL = [
	{ id: 0, name: 'Input' },
	{ id: 1, name: 'Checkbox' },
	{ id: 2, name: 'Single select' },
];

export const CATEGORY = [
	{ id: 0, name: 'Single value' },
	{ id: 1, name: 'Range value' },
	{ id: 2, name: 'Per unit' },
];
