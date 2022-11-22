import React, { useEffect } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Container } from '@mui/material';

import { ROUTES } from '_constants/routes';

import { CHeader } from './CHeader';

import { getAcademicYears, getSemesters } from '_api/options.api';

import { isSuccess } from '_func/';

import { actions } from '_slices/options.slice';

import './index.scss';

export const CMainLayout = () => {
	const isLogined = useSelector((state) => state.auth.isLogined);

	const dispatch = useDispatch();

	useEffect(() => {
		const getOptions = async () => {
			try {
				const res = await getAcademicYears();

				if (isSuccess(res)) dispatch(actions.setAcademicYears(res.data));

				const _res = await getSemesters();

				if (isSuccess(_res)) dispatch(actions.setSemesters(_res.data));
			} catch (error) {
				throw error;
			}
		};

		getOptions();
	}, [dispatch]);

	return isLogined ? (
		<>
			<CHeader />

			<main>
				<Container maxWidth='xl'>
					<Outlet />
				</Container>
			</main>
		</>
	) : (
		<Navigate to={ROUTES.LOGIN} replace={true} />
	);
};
