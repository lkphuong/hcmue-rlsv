import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const CurrentSheetPage = lazy(() => import('_modules/home/pages/CurrentSheetPage'));
const StudentDetailPage = lazy(() => import('_modules/home/pages/StudentDetailPage'));
const HistoryStudentSheetsPage = lazy(() => import('_modules/home/pages/HistoryStudentSheetsPage'));

const CurrentClassSheetsPage = lazy(() => import('_modules/class/pages/CurrentClassSheetsPage'));
const HistoryClassSheetsPage = lazy(() => import('_modules/class/pages/HistoryClassSheetsPage'));
const ListStudentSheetsPage = lazy(() => import('_modules/class/pages/ListStudentSheetsPage'));
const ClassDetailPage = lazy(() => import('_modules/class/pages/ClassDetailPage'));

export const CLASS_ROUTES = [
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
		path: ROUTES.STUDENT.HISTORY_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<StudentDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.CLASS_OFFICER.CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<CurrentClassSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.CLASS_OFFICER.CLASS_LIST,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<ListStudentSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.CLASS_OFFICER.DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<ClassDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.CLASS_OFFICER.CLASS_HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<HistoryClassSheetsPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.CLASS_OFFICER.HISTORY_LIST,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<ListStudentSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.CLASS_OFFICER.HISTORY_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<ClassDetailPage />
			</CPermission>
		),
	},
];
