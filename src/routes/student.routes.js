import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

export const STUDENT_ROUTES = [
	{
		path: ROUTES.STUDENT.SELF,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<div>Điểm rèn luyện của tôi</div>
			</CPermission>
		),
	},
	{
		path: ROUTES.STUDENT.HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<div>Lịch sử điểm rèn luyện của tôi</div>
			</CPermission>
		),
	},
];
