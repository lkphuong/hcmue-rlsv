import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const FormCreatePage = lazy(() => import('_modules/form/pages/FormCreatePage'));
const FormUpdatePage = lazy(() => import('_modules/form/pages/FormUpdatePage'));
const ListFormsPage = lazy(() => import('_modules/form/pages/ListFormsPage'));

const SheetsManagementPage = lazy(() => import('_modules/sheets/pages/SheetsManagementPage'));
const SheetsDepartmentPage = lazy(() => import('_modules/sheets/pages/SheetsDepartmentPage'));

const HistorySheetsPage = lazy(() => import('_modules/sheets/pages/HistorySheetsPage'));

const ListStudentsPage = lazy(() => import('_modules/students/pages/ListStudentsPage'));

const ListAdvisersPage = lazy(() => import('_modules/advisers/pages/ListAdvisersPage'));

const ListPageStatistic = lazy(() => import('_modules/statistic/pages/ListPageStatistic'));

const ListDepartmentAccountPage = lazy(() =>
	import('_modules/department/pages/ListDepartmentAccountPage')
);

const ConfigPage = lazy(() => import('_modules/config/pages/ConfigPage'));

const ChangePasswordPage = lazy(() => import('_modules/auth/pages/ChangePassword'));

export const ADMIN_ROUTES = [
	{
		path: ROUTES.ADMIN.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ListPageStatistic />
			</CPermission>
		),
	},
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
		path: ROUTES.ADMIN.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<HistorySheetsPage />
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
	{
		path: ROUTES.ADMIN.CHANGE_PASSWORD,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ChangePasswordPage />
			</CPermission>
		),
	},
];
