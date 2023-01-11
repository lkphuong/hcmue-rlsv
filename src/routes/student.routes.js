import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const CurrentSheetPage = lazy(() => import('_modules/home/pages/CurrentSheetPage'));
const StudentDetailPage = lazy(() => import('_modules/home/pages/StudentDetailPage'));

const HistoryStudentSheetsPage = lazy(() => import('_modules/home/pages/HistoryStudentSheetsPage'));

const ChangePasswordPage = lazy(() => import('_modules/auth/pages/ChangePassword'));

export const STUDENT_ROUTES = [
	{
		path: ROUTES.STUDENT.SELF,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<CurrentSheetPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.STUDENT.DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<StudentDetailPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.STUDENT.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<HistoryStudentSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.STUDENT.CHANGE_PASSWORD,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<ChangePasswordPage />
			</CPermission>
		),
	},
];
