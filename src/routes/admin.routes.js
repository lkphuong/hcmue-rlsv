import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';

import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const FormCreatePage = lazy(() => import('_modules/form/pages/FormCreatePage'));
const FormUpdatePage = lazy(() => import('_modules/form/pages/FormUpdatePage'));
const ListFormsPage = lazy(() => import('_modules/form/pages/ListFormsPage'));

const SheetsManagementPage = lazy(() => import('_modules/sheets/pages/SheetsManagementPage'));
const HistorySheetsPage = lazy(() => import('_modules/sheets/pages/HistorySheetsPage'));
const SheetsDepartmentPage = lazy(() => import('_modules/sheets/pages/SheetsDepartmentPage'));
const SheetDetailPage = lazy(() => import('_modules/sheets/pages/SheetDetailPage'));

const DepartmentReportPage = lazy(() => import('_modules/reports/pages/DepartmentReportPage'));
const ClassReportPage = lazy(() => import('_modules/reports/pages/ClassReportPage'));
const ReportStudentsPage = lazy(() => import('_modules/reports/pages/ReportStudentsPage'));

const ListStudentsPage = lazy(() => import('_modules/students/pages/ListStudentsPage'));
const ListAdvisersPage = lazy(() => import('_modules/advisers/pages/ListAdvisersPage'));
const ListDepartmentAccountPage = lazy(() =>
	import('_modules/department/pages/ListDepartmentAccountPage')
);
const ConfigPage = lazy(() => import('_modules/config/pages/ConfigPage'));

export const ADMIN_ROUTES = [
	{
		path: ROUTES.ADMIN.FORMS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ListFormsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.FORMS_CREATE,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<FormCreatePage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.FORMS_UPDATE,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<FormUpdatePage />
			</CPermission>
		),
	},

	{
		path: ROUTES.ADMIN.SHEETS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<SheetsManagementPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.SHEETS_DEPARTMENT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<SheetsDepartmentPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.SHEET_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<SheetDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.ADMIN.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<HistorySheetsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.HISTORY_DEPARTMENT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<SheetsDepartmentPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.HISTORY_DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<SheetDetailPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.ADMIN.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<DepartmentReportPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.REPORT_DEPARTMENT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ClassReportPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.REPORT_CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ReportStudentsPage />
			</CPermission>
		),
	},

	{
		path: ROUTES.ADMIN.STUDENTS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ListStudentsPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.ADVISERS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ListAdvisersPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.DEPARTMENTS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ListDepartmentAccountPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.SETTING,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ConfigPage />
			</CPermission>
		),
	},
];
