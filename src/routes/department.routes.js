import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const SheetsManagementPage = lazy(() => import('_modules/department/pages/SheetsManagementPage'));
const SheetsDepartmentPage = lazy(() => import('_modules/department/pages/SheetsDepartmentPage'));

const HistorySheetsPage = lazy(() => import('_modules/department/pages/HistorySheetsPage'));
const HistoryDepartmentPage = lazy(() => import('_modules/department/pages/HistoryDepartmentPage'));

const DepartmentDetailPage = lazy(() => import('_modules/department/pages/DepartmentDetailPage'));

const ReportDepartmentPage = lazy(() => import('_modules/department/pages/ReportDepartmentPage'));
const ReportClassPage = lazy(() => import('_modules/department/pages/ReportClassPage'));

export const DEPARTMENT_ROUTES = [
	{
		path: ROUTES.DEPARTMENT.SHEETS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<SheetsManagementPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.SHEETS_DEPARTMENT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<SheetsDepartmentPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.SHEET_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<DepartmentDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.DEPARTMENT.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<HistorySheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.HISTORY_DEPARTMENT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<HistoryDepartmentPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.HISTORY_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<DepartmentDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.DEPARTMENT.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<ReportDepartmentPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.REPORT_CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<ReportClassPage />
			</CPermission>
		),
	},
];
