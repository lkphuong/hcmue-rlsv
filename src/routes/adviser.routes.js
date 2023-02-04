import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const CurrentClassSheetsPage = lazy(() => import('_modules/advisers/pages/CurrentClassSheetsPage'));
const ListStudentSheetsPage = lazy(() => import('_modules/advisers/pages/ListStudentSheetsPage'));

const HistorySheetsPage = lazy(() => import('_modules/advisers/pages/HistorySheetsPage'));
const HistoryClassPage = lazy(() => import('_modules/advisers/pages/HistoryClassPage'));

const AdviserDetailPage = lazy(() => import('_modules/advisers/pages/AdviserDetailPage'));

const ReportPage = lazy(() => import('_modules/advisers/pages/ReportPage'));
const ReportClassPage = lazy(() => import('_modules/advisers/pages/ReportClassPage'));

const RolesPage = lazy(() => import('_modules/advisers/pages/RolesPage'));

export const ADVISER_ROUTES = [
	{
		path: ROUTES.ADVISER.SHEETS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<CurrentClassSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.SHEETS_CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<ListStudentSheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.SHEET_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<AdviserDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.ADVISER.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<HistorySheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.HISTORY_CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<HistoryClassPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.HISTORY_DETAIL,
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
		path: ROUTES.ADVISER.REPORT_CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<ReportClassPage />
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
