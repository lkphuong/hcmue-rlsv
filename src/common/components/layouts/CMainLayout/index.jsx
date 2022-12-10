import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

import { drawerWidth } from '_store/constant';
import { actions } from '_slices/menu.slice';
import { actions as optionsAction } from '_slices/options.slice';

import { getAcademicYears, getSemesters, getAllDepartments } from '_api/options.api';

import { isSuccess } from '_func/';

import { ROUTES } from '_constants/routes';

import { SuspenseLoading } from '_others/';

import CHeader from './CHeader';
import CSidebar from './CSidebar';

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
	const theme = useTheme();
	const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
	const isLogined = useSelector((state) => state.auth.isLogined);

	// Handle left drawer
	const leftDrawerOpened = useSelector((state) => state.menu.opened);
	const dispatch = useDispatch();
	const handleLeftDrawerToggle = () => {
		dispatch(actions.setMenu(!leftDrawerOpened));
	};

	useEffect(() => {
		const getOptions = async () => {
			try {
				const resAcademic = await getAcademicYears();

				if (isSuccess(resAcademic)) {
					const academics = resAcademic.data.map((e) => ({ ...e, id: parseInt(e.id) }));

					dispatch(optionsAction.setAcademicYears(academics));
				}

				const resSemester = await getSemesters();

				if (isSuccess(resSemester)) {
					const semesters = resSemester.data.map((e) => ({ ...e, id: parseInt(e.id) }));

					dispatch(optionsAction.setSemesters(semesters));
				}

				const resDepartment = await getAllDepartments();

				if (isSuccess(resDepartment)) {
					const departments = resDepartment.data.map((e) => ({
						...e,
						id: e.id,
					}));

					dispatch(optionsAction.setDepartments(departments));
				}
			} catch (error) {
				throw error;
			}
		};

		getOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		dispatch(actions.setMenu(!matchDownMd));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchDownMd]);

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
				<Toolbar>
					<CHeader handleLeftDrawerToggle={handleLeftDrawerToggle} />
				</Toolbar>
			</AppBar>

			<CSidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

			<Main theme={theme} open={leftDrawerOpened}>
				<Suspense fallback={<SuspenseLoading />}>
					<Outlet />
				</Suspense>
			</Main>
		</Box>
	) : (
		<Navigate to={ROUTES.LOGIN} replace={true} />
	);
};
