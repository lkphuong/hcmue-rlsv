import { Navigate } from 'react-router-dom';

import { shallowEqual, useSelector } from 'react-redux';

import { ROUTES } from '_constants/routes';

import { LoginPage } from '_modules/auth/pages';

const HOME_ROUTE = {
	0: ROUTES.STUDENT.SELF,
	1: ROUTES.CLASS_OFFICER.SELF,
	2: ROUTES.CLASS_OFFICER.SELF,
	3: ROUTES.CLASS_OFFICER.SELF,
	4: ROUTES.ADVISER.CLASS,
	5: ROUTES.DEPARTMENT.DEPARTMENT,
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
	console.log('🚀 ~ file: index.jsx:32 ~ CLoginLayout ~ role_id', role_id);
	console.log(ROUTES.ADMIN.REPORT);
	console.log(`/${HOME_ROUTE[role_id]}`);

	return <Navigate to={`${HOME_ROUTE[role_id]}`} replace={true} />;
};
