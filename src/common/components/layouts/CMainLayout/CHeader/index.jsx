import React from 'react';

import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { CNavigation } from '../CNavigation';

import { tryLogout } from '_axios/';

import './index.scss';

export const CHeader = () => {
	//#region Data
	const profile = useSelector((state) => state.auth.profile);
	//#endregion

	//#region Event
	const onLogout = () => tryLogout();
	//#endregion

	//#region Render
	return (
		<Box component='header'>
			<Container maxWidth='xl' sx={{ height: '100%' }}>
				<Grid container alignItems='center' justifyContent='center' height='inherit'>
					<Grid item xl={8}>
						<CNavigation />
					</Grid>
					<Grid item xl={4}>
						<Box
							sx={{ float: 'right' }}
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<Box mr={2}>
								<Typography>
									Xin chào,&nbsp;
									<Typography fontSize='110%' fontWeight={500} component='span'>
										{profile?.fullname}
									</Typography>
								</Typography>
							</Box>
							<Link to='/login'>
								<Button onClick={onLogout}>Thoát</Button>
							</Link>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
	//#endregion
};
