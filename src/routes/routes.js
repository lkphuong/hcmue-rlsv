import { lazy } from 'react';

import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import { CErrorPage } from '_others';

import { ADMIN_ROUTES } from './admin.routes';
import { ADVISER_ROUTES } from './adviser.routes';
import { CLASS_ROUTES } from './class.routes';
import { DEPARTMENT_ROUTES } from './department.routes';
import { STUDENT_ROUTES } from './student.routes';

const ChangePasswordPage = lazy(() => import('_modules/auth/pages/ChangePassword'));
const ForgotPasswordPage = lazy(() => import('_modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('_modules/auth/pages/ResetPasswordPage'));

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
			{
				path: ROUTES.CHANGE_PASSWORD,
				errorElement: <CErrorPage />,
				element: <ChangePasswordPage />,
			},
		],
	},
	{
		path: ROUTES.LOGIN,
		errorElement: <CErrorPage />,
		element: <CLoginLayout />,
	},
	{
		path: ROUTES.FORGOT_PASSWORD,
		errorElement: <CErrorPage />,
		element: <ForgotPasswordPage />,
	},
	{
		path: ROUTES.RESET_PASSWORD,
		errorElement: <CErrorPage />,
		element: <ResetPasswordPage />,
	},
];
