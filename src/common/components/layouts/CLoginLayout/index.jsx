import React, { useMemo } from 'react';

import { Navigate } from 'react-router-dom';

import { shallowEqual, useSelector } from 'react-redux';

import { ROUTES } from '_constants/routes';

import { LoginPage } from '_modules/auth/pages';

export const CLoginLayout = () => {
	const { isLogined, profile } = useSelector(
		(state) => ({
			isLogined: state.auth.isLogined,
			profile: state.auth.profile,
		}),
		shallowEqual
	);

	const correctDashboard = useMemo(() => {
		const role_id = profile?.role_id;
		switch (role_id) {
			case 3:
				return ROUTES.FORM;
			case 2:
				return ROUTES.LIST;
			default:
				return ROUTES.MY_SCORE;
		}
	}, [profile]);

	if (!isLogined) return <LoginPage />;

	return <Navigate to={correctDashboard} replace={true} />;
};
