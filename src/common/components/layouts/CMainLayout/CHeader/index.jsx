import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography, useMediaQuery } from '@mui/material';
import { List } from '@mui/icons-material';

import PropTypes from 'prop-types';

import CLogo from '../CLogo';
import CProfile from './CProfile';

const Header = ({ handleLeftDrawerToggle }) => {
	const theme = useTheme();

	const isBelowMd = useMediaQuery((theme) => theme.breakpoints.down('md'));

	return (
		<>
			<Box
				sx={{
					width: 228,
					display: 'flex',
					[theme.breakpoints.down('md')]: {
						width: 'auto',
					},
				}}
			>
				<Box
					textAlign='center'
					component='span'
					sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}
				>
					<CLogo />
				</Box>
				<ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
					<Avatar
						variant='rounded'
						sx={{
							...theme.typography.commonAvatar,
							...theme.typography.mediumAvatar,
							transition: 'all .2s ease-in-out',
							background: '#eff5f8',
							color: theme.palette.secondary.dark,
							'&:hover': {
								background: '#FFF2F2',
								color: '#CF373D',
							},
						}}
						onClick={handleLeftDrawerToggle}
						color='inherit'
					>
						<List stroke={1.5} size='1.3rem' />
					</Avatar>
				</ButtonBase>
			</Box>
			{!isBelowMd && (
				<Box sx={{ flexGrow: 1 }} textAlign='center'>
					<Typography
						fontWeight={700}
						textAlign='center'
						color='#2A61A2'
						fontSize='1.15rem'
						lineHeight={1.5}
						letterSpacing={2}
					>
						CHUYÊN TRANG ĐÁNH GIÁ ĐIỂM RÈN LUYỆN SINH VIÊN
					</Typography>
					<Typography
						textAlign='center'
						color='#2A61A2'
						fontSize='1.1rem'
						lineHeight={1.4}
						letterSpacing={2}
					>
						TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH
					</Typography>
				</Box>
			)}

			<CProfile />
		</>
	);
};

Header.propTypes = {
	handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
