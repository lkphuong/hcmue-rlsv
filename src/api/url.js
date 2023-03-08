export const AUTH = {
	LOGIN: '/auth/login',
	PROFILE: '/auth/get-profile',
	REFETCH_TOKEN: '/auth/renew-token',
	LOGOUT: '/auth/logout',
	CHANGE_PASSWORD: '/auth/change-password',

	FORGOT_PASSWORD: '/auth/forgot-password',
	RESET_PASSWORD: '/auth/reset-password',
	RESTORE_PASSWORD: '/auth/reset-password', //:id
};

export const SHEETS = {
	GET_BY_ID: '/sheets',
	GET_MARK: '/sheets', //  /sheets/:id/items/:title_id
	GET_ITEMS_MARK: '/sheets/items',

	GET_BY_STD_CODE: '/sheets/student', // :std_code
	STUDENT_GET_HISTORY: '/sheets/student/history',
	UPDATE_STUDENT_SHEET: '/sheets/student',

	GET_CURRENT_CLASS_SHEET: '/sheets/adviser',
	CLASS_GET_HISTORY: '/sheets/adviser/history',

	SHEETS_GET_BY_CLASS_ID: '/sheets/class',
	UPDATE_CLASS_SHEET: '/sheets/class',

	GET_ALL_IN_CLASS: '/sheets/class/all',

	UPDATE_ADVISER_SHEET: '/sheets/adviser',

	SHEETS_GET_BY_DEPARTMENT_ID: '/sheets/department',
	UPDATE_DEPARTMENT_SHEET: '/sheets/department',
	DEPARTMENT_GET_SHEETS: '/sheets/department',
	DEPARTMENT_GET_HISTORY: '/sheets/department/history',

	ADMIN_GET_SHEETS: '/sheets/admin',
	ADMIN_GET_HISTORY: '/sheets/admin/history',
	ADMIN_GET_CLASS_SHEETS: '/sheets/admin/class',

	APPROVE_ALL: '/sheets/approve-all',
	GET_DETAIL_SHEET: '/sheets/detail',

	RATING_WEAK: '/sheets/weak', // :id
};

export const FORMS = {
	GET_FORMS: '/forms/all',
	CREATE_FORM: '/forms',
	UPDATE_FORM: '/forms',
	GET_FORM_BY_ID: '/forms',
	DELETE_FORM: '/forms' /* /forms/:id */,
	GET_DETAIL_FORM: '/forms/detail',

	CREATE_HEADER: '/forms/headers',
	GET_HEADERS_BY_FORM_ID: '/forms/headers',
	UPDATE_HEADER: '/forms/headers',
	DELETE_HEADER: '/forms' /* /forms/:form_id/headers/:header_id */,

	CREATE_TITLE: '/forms/titles',
	GET_TITLES_BY_HEADER_ID: '/forms/titles',
	UPDATE_TITLE: '/forms/titles',
	DELETE_TITLE: '/forms' /* /forms/:form_id/headers/:title_id */,

	CREATE_ITEM: '/forms/items',
	GET_ITEMS_BY_TITLE_ID: '/forms/items',
	UPDATE_ITEM: '/forms/items',
	DELETE_ITEM: '/forms' /* /forms/:form_id/headers/:item_id */,

	PUBLISH: '/forms/publish',
	UNPUBLISH: '/forms/un-publish',
	CLONE: '/forms/clone',
};

export const CLASSES = {
	GET_CLASSES_BY_DEPARTMENT_ID: '/classes', // :department_id
};

export const OPTIONS = {
	GET_ACADEMIC_YEARS: '/academic-years',
	CREATE_ACADEMIC_YEARS: '/academic-years',
	DELETE_ACADEMIC_YEARS: '/academic-years',

	GET_ALL_SEMESTERS: '/semesters/all',
	GET_SEMESTERS_BY_YEAR: '/semesters', // :academic_id
	CREATE_SEMESTERS: '/semesters',
	DELETE_SEMESTERS: '/semesters',
};

export const USERS = {
	GET_STUDENTS: '/users',

	IMPORT_STUDENTS: '/users/import',
};

export const ROLES = {
	UPDATE_ROLE: '/roles',
};

export const DEPARTMENTS = {
	GET_ALL: '/departments',
};

export const REPORTS = {
	GET_REPORTS: '/reports',

	GET_CLASS_REPORTS: '/reports/class',

	ADMIN_WORD: '/reports/admin/export/word',
	ADMIN_EXCEL: '/reports/admin/export/excel',

	DEPARTMENT_WORD: '/reports/department/export/word',
	DEPARTMENT_EXCEL: '/reports/department/export/excel',

	CLASS_WORD: '/reports/class/export/word',
	CLASS_EXCEL: '/reports/class/export/excel',
};

export const LEVELS = {
	GET_LEVELS: '/levels',
};

export const FILES = {
	UPLOAD: '/files/upload',
};

export const OTHERS = {
	GET_DEPARTMENT_ACCOUNTS: '/others/all',
	CREATE_DEPARTMENT_ACCOUNT: '/others',
	UPDATE_DEPARTMENT_ACCOUNT: '/others', // :id
	DELETE_DEPARTMENT_ACCOUNT: '/others', // :id
};

export const ADVISER = {
	GET_ADVISERS: '/advisers/all',

	IMPORT_ADVISERS: '/advisers/import',
};

export const STATUSES = {
	GET_STUDENT_STATUSES: '/statuses',
};
