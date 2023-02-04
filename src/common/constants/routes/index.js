export const ROUTES = {
	LOGIN: '/login',

	HOME: '/',
	//
	STUDENT: {
		SELF: '/student-sheets',
		HISTORY: '/student-history',
		DETAIL: '/student/detail/:sheet_id',
	},

	CLASS_OFFICER: {
		CLASS: '/class/class-sheets',
		CLASS_HISTORY: '/class/class-history',
		STUDENT_LIST: '/class/:class_id',
		DETAIL: '/class/detail/:sheet_id',
	},

	ADVISER: {
		SHEETS: '/adviser/sheets',
		SHEETS_CLASS: '/adviser/sheets/:class_id',
		SHEET_DETAIL: '/adviser/sheets/:class_id/detail/:sheet_id',

		HISTORY: '/adviser/history',
		HISTORY_CLASS: '/adviser/history/:class_id',
		HISTORY_DETAIL: '/adviser/history/:class_id/detail/:sheet_id',

		REPORT: '/adviser/report',
		REPORT_CLASS: '/adviser/report/:class_id',

		ROLE: '/adviser/role',
	},

	DEPARTMENT: {
		SHEETS: '/department/sheets',
		SHEETS_DEPARTMENT: '/department/sheets/:class_id',
		SHEET_DETAIL: '/department/sheets/:class_id/detail/:sheet_id',

		HISTORY: '/department/history',
		HISTORY_DEPARTMENT: '/department/history/:class_id',
		HISTORY_DETAIL: '/department/history/:class_id/detail/:sheet_id',

		REPORT: '/department/report',
		REPORT_CLASS: '/department/report/:class_id',
	},

	ADMIN: {
		REPORT: '/admin/report',
		REPORT_DEPARTMENT: '/admin/report/:department_id',
		REPORT_CLASS: '/admin/report/:department_id/:class_id',

		FORMS: '/admin/forms',
		FORMS_CREATE: '/admin/forms/create',
		FORMS_UPDATE: '/admin/forms/:form_id',

		SHEETS: '/admin/sheets',
		SHEETS_DEPARTMENT: '/admin/sheets/:department_id',
		SHEET_DETAIL: '/admin/sheets/detail/:sheet_id',
		HISTORY: '/admin/history',

		STUDENTS: '/admin/students',
		ADVISERS: '/admin/advisers',
		DEPARTMENTS: '/admin/departments',
		SETTING: '/admin/setting',
	},
	CHANGE_PASSWORD: '/change-password',
};
