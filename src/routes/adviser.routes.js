import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const CurrentClassSheetsPage = lazy(() => import('_modules/advisers/pages/CurrentClassSheetsPage'));
const HistoryClassSheetsPage = lazy(() => import('_modules/advisers/pages/HistoryClassSheetsPage'));
const ListStudentSheetsPage = lazy(() => import('_modules/advisers/pages/ListStudentSheetsPage'));
const AdviserDetailPage = lazy(() => import('_modules/advisers/pages/AdviserDetailPage'));

const ReportPage = lazy(() => import('_modules/advisers/pages/ReportPage'));

const RolesPage = lazy(() => import('_modules/advisers/pages/RolesPage'));

export const ADVISER_ROUTES = [
	{
		path: ROUTES.ADVISER.CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<CurrentClassSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<HistoryClassSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.STUDENT_LIST,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<ListStudentSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<AdviserDetailPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<ReportPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.ROLE,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<RolesPage />
			</CPermission>
		),
	},
];
