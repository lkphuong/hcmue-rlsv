import { ROUTES } from '_constants/routes';

import { CLoginLayout, CMainLayout } from '_layouts/';

import { SemestersPage, SemesterDetail } from '_modules/home/pages';

import { CErrorPage } from '_others';

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
				element: <SemestersPage />,
			},
			{
				path: ROUTES.MY_SCORE_DETAIL,
				errorElement: <CErrorPage />,
				element: <SemesterDetail />,
			},
			{
				path: ROUTES.CLASS_SCORE,
				errorElement: <CErrorPage />,
				element: <div>điểm của lớp</div>,
			},
			{ path: ROUTES.LIST, errorElement: <CErrorPage />, element: <div>dsách phiếu</div> },
			{
				path: ROUTES.STATISTIC,
				errorElement: <CErrorPage />,
				element: <div>thống kê</div>,
			},
		],
	},
	{
		path: ROUTES.LOGIN,
		errorElement: <CErrorPage />,
		element: <CLoginLayout />,
	},
];
