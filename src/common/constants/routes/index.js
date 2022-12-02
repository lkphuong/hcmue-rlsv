export const ROUTES = {
	LOGIN: '/login',

	HOME: '/',

	MY_SCORE: '/my-score',
	MY_SCORE_DETAIL: '/my-score/:sheet_id',

	CLASS_SCORE: '/class-score',
	CLASS_SCORE_DETAIL: '/class-score/:sheet_id',

	LIST: '/list',
	LIST_DETAIL_CLASS: '/list/:class_id',
	LIST_DETAIL_STUDENT: '/list/:class_id/:sheet_id',

	FORM: '/admin/forms',
	FORM_CREATE: '/admin/forms/create',
	FORM_CREATE_HEADERS: '/admin/forms/create/:form_id',
	FORM_UPDATE: '/admin/forms/update/:form_id',

	NOTE: '/admin/notes',

	STATISTIC: '/statistic',

	ROLE: '/admin/roles',

	CONFIG: '/admin/config',
};
