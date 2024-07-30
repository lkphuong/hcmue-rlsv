import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

import { drawerWidth } from '_store/constant';
import { actions } from '_slices/menu.slice';
import { actions as optionsAction } from '_slices/options.slice';

import { getAcademicYears, getAllDepartments } from '_api/options.api';

import { ROUTES } from '_constants/routes';

import { SuspenseLoading } from '_others/';

import CHeader from './CHeader';
import CSidebar from './CSidebar';
import { CTimeline } from './CTimeline';
import { getStatuses } from '_api/statuses.api';
import { useQueries } from '@tanstack/react-query';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		...theme.typography.mainContent,
		...(!open && {
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			[theme.breakpoints.up('md')]: {
				marginLeft: -(drawerWidth - 20),
				width: `calc(100% - ${drawerWidth}px)`,
			},
			[theme.breakpoints.down('md')]: {
				marginLeft: '20px',
				width: `calc(100% - ${drawerWidth}px)`,
				padding: '16px',
			},
			[theme.breakpoints.down('sm')]: {
				marginLeft: '10px',
				width: `calc(100% - ${drawerWidth}px)`,
				padding: '16px',
				marginRight: '10px',
			},
		}),
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 0,
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			width: `calc(100% - ${drawerWidth}px)`,
			[theme.breakpoints.down('md')]: {
				marginLeft: '20px',
			},
			[theme.breakpoints.down('sm')]: {
				marginLeft: '10px',
			},
		}),
	})
);

export const CMainLayout = () => {
	//#region Data
	const theme = useTheme();
	const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

	const isLogined = useSelector((state) => state.auth.isLogined);
	const leftDrawerOpened = useSelector((state) => state.menu.opened);

	const dispatch = useDispatch();

	const { data, pending } = useQueries({
		queries: [
			{ queryKey: ['academic_years'], queryFn: () => getAcademicYears() },
			{ queryKey: ['departments'], queryFn: () => getAllDepartments() },
			{ queryKey: ['statuses'], queryFn: () => getStatuses() },
		],
		combine: (results) => {
			return {
				data: results.map((result) => ({
					...result.data,
					data: result.data?.data?.map((e) => ({ ...e, id: parseInt(e.id) })),
				})),
				pending: results.some((result) => result.isPending),
			};
		},
	});
	//#endregion

	//#region Event
	const handleLeftDrawerToggle = () => {
		dispatch(actions.setMenu(!leftDrawerOpened));
	};
	//#endregion

	useEffect(() => {
		if (!pending) {
			const academic_years = data?.[0]?.data ?? [];
			const departments = data?.[1]?.data ?? [];
			const statuses = data?.[2]?.data ?? [];

			dispatch(optionsAction.setOptions({ academic_years, departments, statuses }));
		}
	}, [data, pending]);

	useEffect(() => {
		dispatch(actions.setMenu(!matchDownMd));
	}, [matchDownMd]);

	//#region Render
	return isLogined ? (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />

			<AppBar
				enableColorOnDark
				position='fixed'
				color='inherit'
				elevation={0}
				sx={{
					bgcolor: theme.palette.background.default,
					transition: leftDrawerOpened ? theme.transitions.create('width') : 'none',
				}}
			>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					<CHeader handleLeftDrawerToggle={handleLeftDrawerToggle} />
				</Toolbar>
			</AppBar>

			<CSidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

			<Main theme={theme} open={leftDrawerOpened} style={{ position: 'relative' }}>
				<CTimeline />

				<Suspense fallback={<SuspenseLoading />}>
					<Outlet />
				</Suspense>
			</Main>
		</Box>
	) : (
		<Navigate to={ROUTES.LOGIN} replace={true} />
	);
	//#endregion
};
