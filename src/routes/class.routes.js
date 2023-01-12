// import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

export const CLASS_ROUTES = [
	{
		path: ROUTES.CLASS_OFFICER.SELF,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<div>Điểm rèn luyện của tôi</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.CLASS_OFFICER.SELF_HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<div>Lịch sử điểm rèn luyện của tôi</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.CLASS_OFFICER.CLASS,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<div>Điểm rèn luyện của lớp</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.CLASS_OFFICER.CLASS_HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<div>Lịch sử điểm rèn luyện của lớp</div>
			</CPermission>
		),
	},
];
