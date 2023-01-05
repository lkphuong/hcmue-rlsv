import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
	Fade,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material/';

import PropTypes from 'prop-types';

import { actions } from '_slices/menu.slice';
import { actions as filterActions } from '_slices/filter.slice';

const CNavItem = ({ item, level, index }) => {
	const { pathname } = useLocation();

	const theme = useTheme();
	const dispatch = useDispatch();
	const customization = useSelector((state) => state.customization);
	const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

	const Icon = item.icon;
	const itemIcon = item?.icon ? (
		<Icon stroke={1.5} size='1.3rem' />
	) : (
		<FiberManualRecord
			sx={{
				width: customization?.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
				height: customization?.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
			}}
			fontSize={level > 0 ? 'inherit' : 'medium'}
		/>
	);

	let itemTarget = '_self';
	if (item.target) {
		itemTarget = '_blank';
	}

	let listItemProps = {
		component: forwardRef((props, ref) => (
			<Link ref={ref} {...props} to={item.path} target={itemTarget} />
		)),
	};
	if (item?.external) {
		listItemProps = { component: 'a', href: item.path, target: itemTarget };
	}

	const itemHandler = (id) => {
		dispatch(filterActions.setFilter(null));

		if (matchesSM) dispatch(actions.setMenu(false));
	};

	// active menu item on page load
	useEffect(() => {
		const currentIndex = document.location.pathname
			.toString()
			.split('/')
			.findIndex((id) => id === item.id);
		if (currentIndex > -1) {
		}
		// eslint-disable-next-line
	}, []);

	return (
		<Fade in timeout={550} style={{ transitionDelay: index * 150 }}>
			<ListItemButton
				{...listItemProps}
				disabled={item.disabled}
				sx={{
					borderRadius: `12px`,
					mb: 0.5,
					alignItems: 'flex-start',
					backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
					py: level > 1 ? 1 : 1.25,
					pl: `${level * 24}px`,
					'&:hover': {
						backgroundColor: 'rgb(151 171 224 / 27%)!important',
						left: '3%',
						'& .MuiListItemText-root p': {
							fontWeight: 600,
						},
					},
				}}
				selected={pathname.includes(item?.path)}
				onClick={() => itemHandler(item.id)}
			>
				<ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>
					{itemIcon}
				</ListItemIcon>
				<ListItemText
					primary={
						<Typography
							variant={pathname.includes(item?.path) ? 'h5' : 'body1'}
							color='inherit'
						>
							{item.title}
						</Typography>
					}
				/>
			</ListItemButton>
		</Fade>
	);
};

CNavItem.propTypes = {
	item: PropTypes.object,
	level: PropTypes.number,
};

export default CNavItem;
