export const AUTH = {
	LOGIN: '/auth/login',
	PROFILE: '/auth/get-profile',
	REFETCH_TOKEN: '/auth/renew-token',
	LOGOUT: '/auth/logout',
};

export const SHEETS = {
	GET_BY_ID: '/sheets',
	GET_MARK: '/sheets', //  /sheets/:id/items/:title_id
	SHEETS_GET_BY_STUDENT_ID: '/sheets/student',
	UPDATE_STUDENT_SHEET: '/sheets/student',
	SHEETS_GET_BY_CLASS_ID: '/sheets/class',
	UPDATE_CLASS_SHEET: '/sheets/class',
	SHEETS_GET_BY_DEPARTMENT_ID: '/sheets/department',
	UPDATE_DEPARTMENT_SHEET: '/sheets/department',
};

export const FORMS = {
	GET_ITEMS_BY_TITLE_ID: '/forms/items',
	GET_FORMS: '/forms',
	CREATE_FORM: '/forms',
	UPDATE_FORM: '/forms',
	GET_FORM_BY_ID: '/forms',

	CREATE_HEADER: '/forms/headers',
	GET_HEADERS_BY_FORM_ID: '/forms/headers',
	UPDATE_HEADER: '/forms/headers',

	CREATE_TITLE: '/forms/titles',
	GET_TITLES_BY_HEADER_ID: '/forms/titles',
	UPDATE_TITLE: '/forms/titles',
};

export const CLASSES = {
	GET_CLASSES: '/classes/all',
};

export const OPTIONS = {
	GET_ACADEMIC_YEARS: '/academic-years',
	GET_SEMESTERS: '/semesters',
};
