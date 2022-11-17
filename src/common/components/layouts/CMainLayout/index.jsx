import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { Container } from '@mui/material';

import { ROUTES } from '_constants/routes';

import { CHeader } from './CHeader';

import './index.scss';

export const CMainLayout = () => {
	const isLogined = useSelector((state) => state.auth.isLogined);

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
