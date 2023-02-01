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
		CLASS: '/adviser/class-sheets',
		HISTORY: '/adviser/class-history',
		STUDENT_LIST: '/adviser/:class_id',
		DETAIL: '/adviser/detail/:sheet_id',

		REPORT: '/adviser/report',

		ROLE: '/adviser/role',
	},

	DEPARTMENT: {
		SHEETS: '/department/sheets',
		SHEETS_DEPARTMENT: '/department/sheets/:class_id',
		SHEET_DETAIL: '/department/sheets/detail/:sheet_id',
		HISTORY: '/department/history',

		REPORT: '/department/report',
	},

	ADMIN: {
		REPORT: '/admin/report',
		REPORT_DEPARTMENT: '/admin/report/:department_id/:info',

		FORMS: '/admin/forms',
		FORMS_CREATE: '/admin/forms/create',
		FORMS_UPDATE: '/admin/forms/:form_id',

		SHEETS: '/admin/sheets',
		SHEETS_DEPARTMENT: '/admin/sheets/:department_id/:department_info',
		SHEET_DETAIL: '/admin/sheets/detail/:sheet_id',
		HISTORY: '/admin/history',

		STUDENTS: '/admin/students',
		ADVISERS: '/admin/advisers',
		DEPARTMENTS: '/admin/departments',
		SETTING: '/admin/setting',
	},
	CHANGE_PASSWORD: '/change-password',
};
