import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import {
	Box,
	Chip,
	ClickAwayListener,
	Divider,
	Fade,
	List,
	ListItemButton,
	ListItemText,
	Paper,
	Popper,
	Stack,
	Typography,
} from '@mui/material';
import { Face4, SentimentSatisfiedAlt, Settings } from '@mui/icons-material';

import { tryLogout } from '_axios/';
import { CStudentCard } from './CStudentCard';

const CProfile = () => {
	//#region Data
	const profile = useSelector((state) => state.auth.profile, shallowEqual);

	const theme = useTheme();

	const [open, setOpen] = useState(false);

	const prevOpen = useRef(open);

	const anchorRef = useRef(null);
	//#endregion

	//#region Event
	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const onLogout = () => tryLogout();

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	//#endregion

	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
	}, [open]);

	//#region Render
	return (
		<>
			<Chip
				sx={{
					height: '48px',
					alignItems: 'center',
					borderRadius: '27px',
					transition: 'all .2s ease-in-out',
					borderColor: theme.palette.primary.light,
					backgroundColor: theme.palette.primary.light,
					'&[aria-controls="menu-list-grow"], &:hover': {
						borderColor: theme.palette.primary.main,
						background: `${theme.palette.primary.main}!important`,
						color: theme.palette.primary.light,
						'& svg': {
							stroke: theme.palette.primary.light,
						},
					},
					'& .MuiChip-label': {
						lineHeight: 0,
					},
				}}
				icon={
					<Face4
						sx={{
							...theme.typography.mediumAvatar,
							margin: '8px 0 8px 8px !important',
							cursor: 'pointer',
						}}
						ref={anchorRef}
						aria-controls={open ? 'menu-list-grow' : undefined}
						aria-haspopup='true'
						color='inherit'
					/>
				}
				label={<Settings stroke={1.5} size='1.5rem' color={theme.palette.primary.main} />}
				variant='outlined'
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup='true'
				onClick={handleToggle}
				color='primary'
			/>
			<Popper
				placement='bottom-end'
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
				popperOptions={{
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [0, 14],
							},
						},
					],
				}}
			>
				{({ TransitionProps }) => (
					<Fade in={open} {...TransitionProps}>
						<Paper sx={{ boxShadow: '0 0 4px 2px rgba(0 0 0 / 20%)', width: 300 }}>
							<ClickAwayListener onClickAway={handleClose}>
								<Paper>
									<Box sx={{ p: 2, pb: 0 }}>
										<Stack>
											<Typography
												variant='h4'
												mb={1}
												display='flex'
												alignItems='center'
												gap={1}
												sx={{ fontWeight: 400 }}
											>
												Xin chào
												<SentimentSatisfiedAlt />
											</Typography>
											{[0, 1, 2, 3].includes(profile?.role) ? (
												<CStudentCard profile={profile} />
											) : (
												<>
													<Typography
														component='span'
														variant='h4'
														mb={1}
													>
														{profile?.fullname}
													</Typography>
													<Typography
														component='span'
														variant='h4'
														mb={2}
													>
														{profile?.username}
													</Typography>
												</>
											)}

											<Divider />
										</Stack>

										<List
											component='nav'
											sx={{
												width: '100%',
												maxWidth: 300,
												minWidth: 200,
												backgroundColor: theme.palette.background.paper,
												borderRadius: '10px',
												[theme.breakpoints.down('md')]: {
													minWidth: '100%',
												},
												'& .MuiListItemButton-root': {
													mt: 0.5,
												},
											}}
										>
											<Link to='/login'>
												<ListItemButton
													sx={{ borderRadius: `12px` }}
													onClick={onLogout}
												>
													<ListItemText
														primary={
															<Typography
																variant='body2'
																fontWeight={600}
															>
																Thoát
															</Typography>
														}
													/>
												</ListItemButton>
											</Link>
											<Link to='/change-password'>
												<ListItemButton sx={{ borderRadius: `12px` }}>
													<ListItemText
														primary={
															<Typography variant='body2'>
																Đổi mật khẩu
															</Typography>
														}
													/>
												</ListItemButton>
											</Link>
										</List>
									</Box>
								</Paper>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	);
	//#endregion
};

export default CProfile;
