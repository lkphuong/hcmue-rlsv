import { BrowserView, MobileView } from 'react-device-detect';

import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

import { drawerWidth } from '_store/constant';

import PropTypes from 'prop-types';

import CMenuList from './CMenuList';
import CLogo from '../CLogo';

import './index.scss';

const CSidebar = ({ drawerOpen, drawerToggle, window }) => {
	const theme = useTheme();
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

	const drawer = (
		<>
			<Box sx={{ display: { xs: 'block', md: 'none' } }}>
				<Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
					<CLogo />
				</Box>
			</Box>
			<BrowserView>
				<Box sx={{ px: 2 }}>
					<CMenuList />
					<Box className='chicken'></Box>
					<Box className='rhino'></Box>
				</Box>
			</BrowserView>
			<MobileView>
				<Box sx={{ px: 2 }}>
					<CMenuList />
				</Box>
			</MobileView>
		</>
	);

	const container = window !== undefined ? () => window.document.body : undefined;

	return (
		<Box
			component='nav'
			sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }}
			aria-label='mailbox folders'
		>
			<Drawer
				container={container}
				variant={matchUpMd ? 'persistent' : 'temporary'}
				anchor='left'
				open={drawerOpen}
				onClose={drawerToggle}
				sx={{
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						background: theme.palette.background.default,
						color: theme.palette.text.primary,
						borderRight: 'none',
						[theme.breakpoints.up('md')]: {
							top: '88px',
						},
					},
				}}
				ModalProps={{ keepMounted: true }}
				color='inherit'
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

CSidebar.propTypes = {
	drawerOpen: PropTypes.bool,
	drawerToggle: PropTypes.func,
	window: PropTypes.object,
};

export default CSidebar;
