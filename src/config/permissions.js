export const FUNCTION_KEY = {
	READ: 'read',
};

export const ROLES_NAME = {
	STUDENT: 0,

	CLASS: 1,

	DEPARTMENT: 2,

	ADMIN: 3,
};

export const ENTITY_KEY = {
	DASHBOARD: {
		key: 'DASHBOARD',
		roles: [ROLES_NAME.STUDENT, ROLES_NAME.CLASS],
	},
	CLASS_SCORE: {
		key: 'CLASS_SCORE',
		roles: [ROLES_NAME.CLASS],
	},
	SHEET: {
		key: 'SHEET',
		roles: [ROLES_NAME.DEPARTMENT],
	},
	STATISTIC: {
		key: 'STATISTIC',
		roles: [ROLES_NAME.DEPARTMENT, ROLES_NAME.ADMIN],
	},
	FORMS: {
		key: 'FORMS',
		roles: [ROLES_NAME.ADMIN],
	},
	NOTES: {
		key: 'NOTES',
		roles: [ROLES_NAME.ADMIN],
	},
};
