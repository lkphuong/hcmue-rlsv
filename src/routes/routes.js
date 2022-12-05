import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import { CErrorPage } from '_others';

import { CPermission } from '_controls';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';

import { StudentPage, StudentDetailPage } from '_modules/home/pages';

import { ClassPage, ClassDetailPage } from '_modules/class/pages';

import { FormCreatePage, FormUpdatePage, ListFormsPage } from '_modules/form/pages';

import { ListDetailPage, ListPage, StudentListPage } from '_modules/list/pages';

import { ListPageStatistic } from '_modules/statistic/pages';

import { RolePage } from '_modules/role/pages';

import { ConfigPage } from '_modules/config/pages';

import { ListPageAdmin, SheetDetailPage } from '_modules/manager/pages';

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
		],
	},
	{
		path: ROUTES.LOGIN,
		errorElement: <CErrorPage />,
		element: <CLoginLayout />,
	},
];
