import {
	AdminPanelSettings,
	Attribution,
	Face,
	SupervisorAccount,
	TableView,
} from '@mui/icons-material';

import { ENTITY_KEY } from '_config/permissions';

export const NAVIGATIONS = [
	{
		id: 'student',
		title: 'Sinh viên',
		type: 'collapse',
		icon: Face,
		entity: ENTITY_KEY.DASHBOARD.key,
		children: [
			{
				id: 'student-score',
				title: 'Điểm rèn luyện của tôi',
				type: 'item',
				path: '/my-score',
				entity: ENTITY_KEY.DASHBOARD.key,
				breadcrumbs: false,
			},
		],
	},
	{
		id: 'class',
		title: 'Lớp trưởng/Bí thư',
		type: 'collapse',
		icon: Attribution,
		entity: ENTITY_KEY.CLASS_SCORE.key,
		children: [
			{
				id: 'class-score',
				title: 'Điểm rèn luyện của lớp',
				type: 'item',
				path: '/class-score',
				entity: ENTITY_KEY.CLASS_SCORE.key,
				breadcrumbs: false,
			},
		],
	},
	{
		id: 'department',
		title: 'Khoa',
		type: 'collapse',
		icon: SupervisorAccount,
		entity: ENTITY_KEY.SHEET.key,
		children: [
			{
				id: 'department-list',
				title: 'Danh sách phiếu',
				type: 'item',
				path: '/list',
				entity: ENTITY_KEY.SHEET.key,
				breadcrumbs: false,
			},
		],
	},
	{
		id: 'statistic',
		title: 'Thống kê',
		type: 'collapse',
		icon: TableView,
		entity: ENTITY_KEY.STATISTIC.key,
		children: [
			{
				id: 'statistic-list',
				title: 'Thống kê phiếu',
				type: 'item',
				path: '/statistic',
				entity: ENTITY_KEY.STATISTIC.key,
				breadcrumbs: false,
			},
		],
	},
	{
		id: 'admin',
		title: 'Admin',
		type: 'collapse',
		icon: AdminPanelSettings,
		entity: ENTITY_KEY.FORMS.key,
		children: [
			{
				id: 'admin-form',
				title: 'Quản lý biểu mẫu',
				type: 'item',
				path: '/admin/forms',
				entity: ENTITY_KEY.FORMS.key,
				breadcrumbs: false,
			},
			{
				id: 'admin-note',
				title: 'Quản lý danh sách phiếu',
				type: 'item',
				path: '/admin/sheets',
				entity: ENTITY_KEY.NOTES.key,
				breadcrumbs: false,
			},
			{
				id: 'admin-role',
				title: 'Phân quyền',
				type: 'item',
				path: '/admin/roles',
				entity: ENTITY_KEY.NOTES.key,
				breadcrumbs: false,
			},
			{
				id: 'admin-config',
				title: 'Học kỳ-Niên khóa',
				type: 'item',
				path: '/admin/config',
				entity: ENTITY_KEY.NOTES.key,
				breadcrumbs: false,
			},
		],
	},
];
