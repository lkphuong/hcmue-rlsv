export const FUNCTION_KEY = {
	READ: 'read',
};

// export enum RoleCode {
//   STUDENT = 0, //Sinh viên
//   MONITOR = 1, // Lớp trưởng
//   SECRETARY = 2, // Bí thư chi đoàn
//   CHAIRMAN = 3, // Chi hội trưởng
//   ADVISER = 4, // Cố vấn học tập
//   DEPARTMENT = 5, // Khoa
//   ADMIN = 6,
// }

export const ROLES_NAME = {
	STUDENT: 0,

	MONITOR: 1,

	SECRETARY: 2,

	CHAIRMAN: 3,

	ADVISER: 4,

	DEPARTMENT: 5,

	ADMIN: 6,
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
	//
	STUDENT: {
		key: 'STUDENT',
		roles: [ROLES_NAME.STUDENT],
	},
	CLASS: {
		key: 'CLASS',
		roles: [ROLES_NAME.MONITOR, ROLES_NAME.SECRETARY, ROLES_NAME.CHAIRMAN],
	},
	ADVISER: {
		key: 'ADVISER',
		roles: [ROLES_NAME.ADVISER],
	},
	DEPARTMENT: {
		key: 'DEPARTMENT',
		roles: [ROLES_NAME.DEPARTMENT],
	},
	ADMIN: {
		key: 'ADMIN',
		roles: [ROLES_NAME.ADMIN],
	},
};
