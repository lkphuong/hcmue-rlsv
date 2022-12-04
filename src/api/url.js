export const AUTH = {
	LOGIN: '/auth/login',
	PROFILE: '/auth/get-profile',
	REFETCH_TOKEN: '/auth/renew-token',
	LOGOUT: '/auth/logout',
};

export const SHEETS = {
	GET_BY_ID: '/sheets',
	GET_MARK: '/sheets', //  /sheets/:id/items/:title_id
	GET_ITEMS_MARK: '/sheets/items',
	SHEETS_GET_BY_STUDENT_ID: '/sheets/student',
	UPDATE_STUDENT_SHEET: '/sheets/student',
	SHEETS_GET_BY_CLASS_ID: '/sheets/class',
	UPDATE_CLASS_SHEET: '/sheets/class',
	SHEETS_GET_BY_DEPARTMENT_ID: '/sheets/department',
	UPDATE_DEPARTMENT_SHEET: '/sheets/department',
	ADMIN_GET_SHEET: '/sheets/admin',
};

export const FORMS = {
	GET_FORMS: '/forms',
	CREATE_FORM: '/forms',
	UPDATE_FORM: '/forms',
	GET_FORM_BY_ID: '/forms',
	DELETE_FORM: '/forms' /* /forms/:id */,

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
	GET_CLASSES: '/classes',
};

export const OPTIONS = {
	GET_ACADEMIC_YEARS: '/academic-years',
	CREATE_ACADEMIC_YEARS: '/academic-years',
	DELETE_ACADEMIC_YEARS: '/academic-years',

	GET_SEMESTERS: '/semesters',
	CREATE_SEMESTERS: '/semesters',
	DELETE_SEMESTERS: '/semesters',
};

export const USERS = {
	GET_STUDENT: '/users',
};

export const ROLES = {
	UPDATE_ROLE: '/roles',
};

export const DEPARTMENTS = {
	GET_ALL: '/departments',
};

export const REPORTS = {
	GET_REPORTS: '/reports',
};

export const LEVELS = {
	GET_LEVELS: '/levels',
};
