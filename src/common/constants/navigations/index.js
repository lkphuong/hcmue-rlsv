import { ENTITY_KEY } from '_config/permissions';

export const NAVIGATIONS = [
	{
		path: '/my-score',
		name: 'Điểm rèn luyện của tôi',
		entity: ENTITY_KEY.DASHBOARD.key,
	},
	{
		path: '/class-score',
		name: 'Điểm rèn luyện của lớp',
		entity: ENTITY_KEY.CLASS_SCORE.key,
	},
	{
		path: '/list',
		name: 'Danh sách phiếu',
		entity: ENTITY_KEY.SHEET.key,
	},
	{
		path: '/admin/forms',
		name: 'Quản lý biểu mẫu',
		entity: ENTITY_KEY.FORMS.key,
	},
	{
		path: '/admin/notes',
		name: 'Quản lý phiếu đánh giá',
		entity: ENTITY_KEY.NOTES.key,
	},
	{
		path: '/statistic',
		name: 'Thống kê phiếu',
		entity: ENTITY_KEY.STATISTIC.key,
	},
];
