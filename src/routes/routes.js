import { lazy } from 'react';

import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import { CErrorPage } from '_others';

import { CPermission } from '_controls';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';

const StudentPage = lazy(() => import('_modules/home/pages/StudentPage'));
const StudentDetailPage = lazy(() => import('_modules/home/pages/StudentDetailPage'));

const ClassPage = lazy(() => import('_modules/class/pages/ClassPage'));
const ClassDetailPage = lazy(() => import('_modules/class/pages/ClassDetailPage'));

const ListDetailPage = lazy(() => import('_modules/list/pages/ListDetailPage'));
const ListPage = lazy(() => import('_modules/list/pages/ListPage'));
const StudentListPage = lazy(() => import('_modules/list/pages/StudentListPage'));

const ListPageStatistic = lazy(() => import('_modules/statistic/pages/ListPageStatistic'));

const RolePage = lazy(() => import('_modules/role/pages/RolePage'));

const ConfigPage = lazy(() => import('_modules/config/pages/ConfigPage'));

const ListPageAdmin = lazy(() => import('_modules/manager/pages/ListPageAdmin'));
const SheetDetailPage = lazy(() => import('_modules/manager/pages/SheetDetailPage'));

const FormCreatePage = lazy(() => import('_modules/form/pages/FormCreatePage'));
const FormUpdatePage = lazy(() => import('_modules/form/pages/FormUpdatePage'));
const ListFormsPage = lazy(() => import('_modules/form/pages/ListFormsPage'));

const ListStudentsPage = lazy(() => import('_modules/student/pages/ListStudentsPage'));

const ListHistory = lazy(() => import('_modules/history/pages/ListHistory'));

export const browserRouter = [
	{
		path: ROUTES.HOME,
		errorElement: <CErrorPage />,
		element: <CMainLayout />,
		children: [
			{
				path: ROUTES.MY_SCORE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DASHBOARD.key}>
						<StudentPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.MY_SCORE_DETAIL,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DASHBOARD.key}>
						<StudentDetailPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.CLASS_SCORE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS_SCORE.key}>
						<ClassPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.CLASS_SCORE_DETAIL,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS_SCORE.key}>
						<ClassDetailPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.LIST,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.SHEET.key}>
						<ListPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.LIST_DETAIL_CLASS,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.SHEET.key}>
						<StudentListPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.LIST_DETAIL_STUDENT,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.SHEET.key}>
						<ListDetailPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.FORM,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<ListFormsPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.FORM_CREATE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<FormCreatePage />
					</CPermission>
				),
			},
			{
				path: ROUTES.FORM_UPDATE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<FormUpdatePage />
					</CPermission>
				),
			},
			{
				path: ROUTES.ADMIN_SHEET,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.NOTES.key}>
						<ListPageAdmin />
					</CPermission>
				),
			},
			{
				path: ROUTES.STATISTIC,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STATISTIC.key}>
						<ListPageStatistic />
					</CPermission>
				),
			},
			{
				path: ROUTES.ROLE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<RolePage />
					</CPermission>
				),
			},
			{
				path: ROUTES.CONFIG,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<ConfigPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.ADMIN_REMAKE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<SheetDetailPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.ADMIN_STUDENTS,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<ListStudentsPage />
					</CPermission>
				),
			},
			{
				path: ROUTES.ADMIN_HISTORY,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<ListHistory />
					</CPermission>
				),
			},
		],
	},
	{
		path: ROUTES.LOGIN,
		errorElement: <CErrorPage />,
		element: <CLoginLayout />,
	},
];
