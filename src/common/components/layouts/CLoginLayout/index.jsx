import { Navigate } from 'react-router-dom';

import { shallowEqual, useSelector } from 'react-redux';

import { ROUTES } from '_constants/routes';

import { LoginPage } from '_modules/auth/pages';

const HOME_ROUTE = {
	0: ROUTES.STUDENT.SELF,
	1: ROUTES.STUDENT.SELF,
	2: ROUTES.STUDENT.SELF,
	3: ROUTES.STUDENT.SELF,
	4: ROUTES.ADVISER.SHEETS,
	5: ROUTES.DEPARTMENT.SHEETS,
	6: ROUTES.ADMIN.REPORT,
};

export const CLoginLayout = () => {
	const { isLogined, profile } = useSelector(
		(state) => ({
			isLogined: state.auth.isLogined,
			profile: state.auth.profile,
		}),
		shallowEqual
	);

	if (!isLogined) return <LoginPage />;

	const { role_id } = profile;

	return <Navigate to={`${HOME_ROUTE[role_id]}`} replace={true} />;
};
