export const ROUTES = {
	LOGIN: '/login',

	HOME: '/',
	//
	STUDENT: {
		SELF: '/student-sheets',
		DETAIL: '/student-sheets/detail/:sheet_id',

		HISTORY: '/student-history',
		HISTORY_DETAIL: '/student-history/detail/:sheet_id',
	},

	CLASS_OFFICER: {
		CLASS: '/class/sheets',
		CLASS_LIST: '/class/sheets/:class_id',
		DETAIL: '/class/sheets/:class_id/detail/:sheet_id',

		CLASS_HISTORY: '/class/history',
		HISTORY_LIST: '/class/history/:class_id',
		HISTORY_DETAIL: '/class/history/:class_id/detail/:sheet_id',
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
		FORMS: '/admin/forms',
		FORMS_CREATE: '/admin/forms/create',
		FORMS_UPDATE: '/admin/forms/:form_id',

		SHEETS: '/admin/sheets',
		SHEETS_DEPARTMENT: '/admin/sheets/:department_id',
		SHEET_DETAIL: '/admin/sheets/:department_id/detail/:sheet_id',

		HISTORY: '/admin/history',
		HISTORY_DEPARTMENT: '/admin/history/:department_id',
		HISTORY_DETAIL: '/admin/history/:department_id/detail/:sheet_id',

		REPORT: '/admin/report',
		REPORT_DEPARTMENT: '/admin/report/:department_id',
		REPORT_CLASS: '/admin/report/:department_id/:class_id',

		STUDENTS: '/admin/students',
		ADVISERS: '/admin/advisers',
		DEPARTMENTS: '/admin/departments',
		SETTING: '/admin/setting',
	},

	CHANGE_PASSWORD: '/change-password',
	FORGOT_PASSWORD: '/forgot-password',
	RESET_PASSWORD: '/reset-password', //     /?token=
};
