export const ROUTES = {
	LOGIN: '/login',

	HOME: '/',

	MY_SCORE: '/my-score',
	MY_SCORE_DETAIL: '/my-score/:sheet_id',

	CLASS_SCORE: '/class-score',
	CLASS_SCORE_DETAIL: '/class-score/:sheet_id',

	LIST: '/list',
	LIST_DETAIL_CLASS: '/list/:class_id/class/:class_name',
	LIST_DETAIL_STUDENT: '/list/:class_id/:sheet_id/:class_name',

	FORM: '/admin/forms',
	FORM_CREATE: '/admin/forms/create',
	FORM_CREATE_HEADERS: '/admin/forms/create/:form_id',
	FORM_UPDATE: '/admin/forms/update/:form_id',

	STATISTIC: '/statistic',
	//
	STUDENT: {
		SELF: '/student-sheets',
		HISTORY: '/student-history',
		DETAIL: '/student-sheets/:sheet_id',

		CHANGE_PASSWORD: '/change-password',
	},

	CLASS_OFFICER: {
		SELF: '/student/student-sheets',
		SELF_HISTORY: '/student/student-history',

		CLASS: '/class/class-sheets',
		CLASS_HISTORY: '/class/class-history',

		CHANGE_PASSWORD: '/change-password',
	},

	ADVISER: {
		CLASS: '/adviser/class-sheets',
		HISTORY: '/adviser/class-history',

		REPORT: '/adviser/report',

		ROLE: '/adviser/role',

		CHANGE_PASSWORD: '/change-password',
	},

	DEPARTMENT: {
		SHEETS: '/department/sheets',
		SHEETS_DEPARTMENT: '/department/sheets/:class_id',
		SHEET_DETAIL: '/department/sheets/detail/:sheet_id',
		HISTORY: '/department/history',

		REPORT: '/department/report',

		CHANGE_PASSWORD: '/change-password',
	},

	ADMIN: {
		REPORT: '/admin/report',

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

		CHANGE_PASSWORD: '/change-password',
	},
};
