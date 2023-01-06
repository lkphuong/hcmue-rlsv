import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const FormCreatePage = lazy(() => import('_modules/form/pages/FormCreatePage'));
const FormUpdatePage = lazy(() => import('_modules/form/pages/FormUpdatePage'));
const ListFormsPage = lazy(() => import('_modules/form/pages/ListFormsPage'));

const ListHistory = lazy(() => import('_modules/history/pages/ListHistory'));

const ConfigPage = lazy(() => import('_modules/config/pages/ConfigPage'));

const ListStudentsPage = lazy(() => import('_modules/students/pages/ListStudentsPage'));

const ListDepartmentAccountPage = lazy(() =>
	import('_modules/department/pages/ListDepartmentAccountPage')
);

export const ADMIN_ROUTES = [
	{
		path: ROUTES.ADMIN.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<div>Thống kê phiếu</div>
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
		path: ROUTES.ADMIN.SHEETS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<div>Quản lý phiếu đánh giá</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.ADMIN.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADMIN.key}>
				<ListHistory />
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
				<div>Danh sách cố vấn học tập</div>
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
