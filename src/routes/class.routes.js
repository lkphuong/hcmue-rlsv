import { lazy } from 'react';

import { ENTITY_KEY, FUNCTION_KEY } from '_config/permissions';
import { ROUTES } from '_constants/routes';

import { CPermission } from '_controls/';

import { CErrorPage } from '_others/';

const CurrentSheetPage = lazy(() => import('_modules/home/pages/CurrentSheetPage'));
const StudentDetailPage = lazy(() => import('_modules/home/pages/StudentDetailPage'));

const HistoryStudentSheetsPage = lazy(() => import('_modules/home/pages/HistoryStudentSheetsPage'));

export const CLASS_ROUTES = [
	{
		path: ROUTES.STUDENT.SELF,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<CurrentSheetPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.STUDENT.DETAIL,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.STUDENT.key}>
				<StudentDetailPage />
			</CPermission>
		),
	},
	{
		path: ROUTES.STUDENT.SELF_HISTORY,
		errorElement: <CErrorPage />,
		element: (
			<CPermission I={FUNCTION_KEY.READ} a={ENTITY_KEY.CLASS.key}>
				<HistoryStudentSheetsPage />
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
