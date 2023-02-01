import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const SheetsManagementPage = lazy(() => import('_modules/department/pages/SheetsManagementPage'));
const SheetsDepartmentPage = lazy(() => import('_modules/department/pages/SheetsDepartmentPage'));
const DepartmentDetailPage = lazy(() => import('_modules/department/pages/DepartmentDetailPage'));

const HistorySheetsPage = lazy(() => import('_modules/department/pages/HistorySheetsPage'));

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
		path: ROUTES.DEPARTMENT.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<HistorySheetsPage />
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
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<DepartmentDetailPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<div>Thống kê phiếu</div>
			</CPermission>
		),
	},
];
