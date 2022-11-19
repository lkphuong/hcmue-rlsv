import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import {
	SemestersPage as MySemesters,
	SemesterDetail as MyDetailSemester,
} from '_modules/home/pages';
import { SemestersPage as ClassSemesters } from '_modules/class/pages';

import { CErrorPage } from '_others';
import { CPermission } from '_controls/CPermission';
import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';

export const browserRouter = [
	{
		path: ROUTES.HOME,
		errorElement: <CErrorPage />,
		element: <CMainLayout />,
		children: [
			{
				index: true,
				path: ROUTES.MY_SCORE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DASHBOARD.key}>
						<MySemesters />
					</CPermission>
				),
			},
			{
				path: ROUTES.MY_SCORE_DETAIL,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DASHBOARD.key}>
						<MyDetailSemester />
					</CPermission>
				),
			},
			{
				path: ROUTES.CLASS_SCORE,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS_SCORE.key}>
						<ClassSemesters />
					</CPermission>
				),
			},
			{
				path: ROUTES.LIST,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.SHEET.key}>
						<div>dsách phiếu</div>
					</CPermission>
				),
			},
			{
				path: ROUTES.FORM,
				errorElement: <CErrorPage />,
				element: (
					<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.FORMS.key}>
						<div>quản lý biểu mẫu</div>
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
