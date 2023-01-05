import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

export const DEPARTMENT_ROUTES = [
	{
		path: ROUTES.DEPARTMENT.DEPARTMENT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<div>Điểm rèn luyện của khoa</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.DEPARTMENT.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.DEPARTMENT.key}>
				<div>Lịch sử điểm rèn luyện của khoa</div>
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
