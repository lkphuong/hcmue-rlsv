export const TYPE_NUMBER = /^[0-9-]+$/;

export const SORT_ORDER = [
	{ id: 1, value: 1, name: 'Xuất sắc' },
	{ id: 2, value: 2, name: 'Tốt' },
	{ id: 3, value: 3, name: 'Khá' },
	{ id: 4, value: 4, name: 'Trung bình' },
	{ id: 5, value: 5, name: 'Yếu' },
	{ id: 6, value: 6, name: 'Kém' },
];

export const STATUS = [
	{ id: 0, value: 0, name: 'Chưa đánh giá' },
	{ id: 1, value: 1, name: 'Chờ lớp xét duyệt' },
	{ id: 2, value: 2, name: 'Lớp quá hạn duyệt' },
	{ id: 3, value: 3, name: 'Chờ khoa xét duyệt' },
	{ id: 4, value: 4, name: 'Khoa quá hạn duyệt' },
	{ id: 5, value: 5, name: 'Hoàn thành' },
	{ id: 6, value: 6, name: 'Không xếp loại' },
];

export const FORM_STATUS = [
	{ id: 0, value: 0, name: 'Nháp' },
	{ id: 1, value: 1, name: 'Chờ phát hành' },
	{ id: 2, value: 2, name: 'Đang phát hành' },
	{ id: 3, value: 3, name: 'Đã phát hành' },
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

export const ROLES = [
	{ id: 0, name: 'SINH VIÊN' },
	{ id: 1, name: 'LỚP TRƯỞNG' },
	{ id: 2, name: 'BÍ THƯ CHI ĐOÀN' },
	{ id: 3, name: 'CHI HỘI TRƯỞNG' },
	{ id: 4, name: 'CỐ VẤN HỌC TẬP' },
	{ id: 5, name: 'KHOA' },
	{ id: 6, name: 'ADMIN' },
];
