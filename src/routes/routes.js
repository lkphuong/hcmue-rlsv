import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import { CErrorPage } from '_others';

import { ADMIN_ROUTES } from './admin.routes';
import { ADVISER_ROUTES } from './adviser.routes';
import { CLASS_ROUTES } from './class.routes';
import { DEPARTMENT_ROUTES } from './department.routes';
import { STUDENT_ROUTES } from './student.routes';

export const browserRouter = [
	{
		path: ROUTES.HOME,
		errorElement: <CErrorPage />,
		element: <CMainLayout />,
		children: [
			...STUDENT_ROUTES,
			...CLASS_ROUTES,
			...ADVISER_ROUTES,
			...DEPARTMENT_ROUTES,
			...ADMIN_ROUTES,
		],
	},
	{
		path: ROUTES.LOGIN,
		errorElement: <CErrorPage />,
		element: <CLoginLayout />,
	},
];
