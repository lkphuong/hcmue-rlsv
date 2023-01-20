import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const RolesPage = lazy(() => import('_modules/advisers/pages/RolesPage'));

export const ADVISER_ROUTES = [
	{
		path: ROUTES.ADVISER.CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<div>Điểm rèn luyện của lớp</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<div>Lịch sử điểm rèn luyện của lớp</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.REPORT,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<div>Thống kê phiếu</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.ADVISER.ROLE,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.ADVISER.key}>
				<RolesPage />
			</CPermission>
		),
	},
];
