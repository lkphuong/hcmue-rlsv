import React, { useEffect, useState } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { StyledEngineProvider, ThemeProvider } from '@mui/material';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { AbilityContext } from '_contexts';

import ability from '_config/casl_ability';

import { browserRouter } from '_routes/routes';

import { getProfile, tryLogout } from '_axios/';

import { SuspenseLoading } from '_others/';

import theme from '_theme';

import '_styles/index.scss';

dayjs.extend(isBetween);

const router = createBrowserRouter(browserRouter);

function App() {
	//#region Data
	const [isLoading, setLoading] = useState(true);

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
			} finally {
				setLoading(false);
			}
		};

		!isLogined && init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLogined]);

	if (isLoading) return <SuspenseLoading />;

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme()}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<AbilityContext.Provider value={ability}>
						<div className='App'>
							<RouterProvider router={router} />
						</div>
					</AbilityContext.Provider>
				</LocalizationProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

export default App;
