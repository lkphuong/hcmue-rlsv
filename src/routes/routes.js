import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import { CErrorPage } from '_others';

import { CPermission } from '_controls';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';

import { StudentPage, StudentDetailPage } from '_modules/home/pages';

import { ClassPage, ClassDetailPage } from '_modules/class/pages';

import { FormCreatePage, FormUpdatePage, ListFormsPage } from '_modules/form/pages';

import { ListPage, StudentListPage } from '_modules/list/pages';

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
						<div>thông tin phiếu của sinh viên</div>
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
				path: ROUTES.NOTE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.NOTES.key}>
						<div>quản lý phiếu đánh giá</div>
					</CPermission>
				),
			},
			{
				path: ROUTES.STATISTIC,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STATISTIC.key}>
						<div>thống kê phiếu</div>
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
