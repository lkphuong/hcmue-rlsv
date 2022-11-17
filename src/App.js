import React, { Suspense, useEffect } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material';

import { browserRouter } from '_routes/routes';

import theme from '_theme';

import { getProfile, tryLogout } from '_axios/';

import { SuspenseLoading } from '_others/';

import '_styles/index.scss';

const router = createBrowserRouter(browserRouter);

function App() {
	//#region Data
	const token = localStorage.getItem('access_token');

	const { isLogined } = useSelector((state) => state.auth.isLogined);
	//#endregion

	useEffect(() => {
		const init = async () => {
			try {
				if (token) {
					await getProfile(token);
				} else {
					await tryLogout();
				}
			} catch (error) {
				console.log(error);
			}
		};

		!isLogined && init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLogined]);

	return (
		<ThemeProvider theme={theme}>
			<Suspense fallback={<SuspenseLoading />}>
				<div className='App'>
					<RouterProvider router={router} />
				</div>
			</Suspense>
		</ThemeProvider>
	);
}

export default App;
