export const TYPE_NUMBER = /^[0-9-]+$/;

export const FILE_NAME_REGEX = /^[A-Za-z0-9-_\s]+$/;

export const EXCEL_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const SORT_ORDER = [
	{ id: 1, value: 1, name: 'Xuất sắc' },
	{ id: 2, value: 2, name: 'Tốt' },
	{ id: 3, value: 3, name: 'Khá' },
	{ id: 4, value: 4, name: 'Trung bình' },
	{ id: 5, value: 5, name: 'Yếu' },
	{ id: 6, value: 6, name: 'Kém' },
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
	// { id: 0, name: 'Single value' },
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

export const SHEET_STATUS = [
	{ id: 0, name: 'Chưa đánh giá' },
	{ id: 1, name: 'Chờ lớp xét duyệt' },
	{ id: 2, name: 'Chờ CVHT xét duyệt' },
	{ id: 3, name: 'Chờ khoa xét duyệt' },
	{ id: 4, name: 'Hoàn thành' },
	{ id: 5, name: 'Không đánh giá' },
];

export const FILE_NAMES = {
	ADMIN_WORD: 'BIÊN BẢN HỌP HỘI ĐỒNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN CẤP TRƯỜNG.docx',
	ADMIN_EXCEL: 'BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN CẤP TRƯỜNG.xlsx',

	DEPARTMENT_WORD: 'BIÊN BẢN HỌP HỘI ĐỒNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN CẤP KHOA.docx',
	DEPARTMENT_EXCEL: 'BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN CẤP KHOA.xlsx',

	CLASS_WORD: 'BIÊN BẢN HỌP LỚP.docx',
	CLASS_EXCEL: 'BẢNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN CẤP LỚP.xlsx',
};
