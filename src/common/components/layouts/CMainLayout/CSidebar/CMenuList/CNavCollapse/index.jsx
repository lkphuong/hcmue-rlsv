import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import {
	Collapse,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { ExpandMore, ExpandLess, FiberManualRecord } from '@mui/icons-material';

import PropTypes from 'prop-types';

import CNavItem from '../CNavItem';

const SPECIFIC_TITLE = {
	1: 'Lớp trưởng',
	2: 'Bí thư chi đoàn',
	3: 'Chi hội trưởng',
};

const CNavCollapse = ({ menu, level }) => {
	//#region Data
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	console.log(role_id);

	const theme = useTheme();
	const { pathname } = useLocation();

	const selected = useMemo(() => {
		for (let e of menu.children) {
			if (pathname.includes(e.path)) return true;
		}

		return false;
	}, [menu, pathname]);

	const [open, setOpen] = useState(selected || false);

	// menu collapse & item
	const menus = menu.children?.map((item) => {
		switch (item.type) {
			case 'collapse':
				return <CNavCollapse key={item.id} menu={item} level={level + 1} />;
			case 'item':
				return <CNavItem key={item.id} item={item} level={level + 1} />;
			default:
				return (
					<Typography key={item.id} variant='h6' color='error' align='center'>
						Menu Items Error
					</Typography>
				);
		}
	});

	const Icon = menu.icon;
	const menuIcon = menu.icon ? (
		<Icon strokeWidth={1.5} size='1.3rem' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
	) : (
		<FiberManualRecord
			sx={{
				width: selected === menu.id ? 8 : 6,
				height: selected === menu.id ? 8 : 6,
			}}
			fontSize={level > 0 ? 'inherit' : 'medium'}
		/>
	);
	//#endregion

	//#region Event
	const handleClick = () => {
		setOpen(!open);
	};
	//#endregion

	//#region Render
	return (
		<>
			<ListItemButton
				sx={{
					borderRadius: `12px`,
					mb: 0.5,
					alignItems: 'flex-start',
					backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
					py: level > 1 ? 1 : 1.25,
					pl: `${level * 24}px`,
				}}
				selected={selected}
				onClick={handleClick}
			>
				<ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
					{menuIcon}
				</ListItemIcon>
				<ListItemText
					primary={
						<Typography variant='h5' color='inherit' sx={{ my: 'auto' }}>
							{(menu.title === 'Lớp trưởng' && SPECIFIC_TITLE[role_id]) || menu.title}
						</Typography>
					}
					secondary={
						menu.caption && (
							<Typography
								variant='caption'
								sx={{ ...theme.typography.subMenuCaption }}
								display='block'
								gutterBottom
							>
								{menu.caption}
							</Typography>
						)
					}
				/>
				{open ? (
					<ExpandLess style={{ marginTop: 'auto', marginBottom: 'auto' }} />
				) : (
					<ExpandMore style={{ marginTop: 'auto', marginBottom: 'auto' }} />
				)}
			</ListItemButton>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<List
					component='div'
					disablePadding
					sx={{
						position: 'relative',
						'&:after': {
							content: "''",
							position: 'absolute',
							left: '24px',
							top: 0,
							height: '100%',
							width: '1px',
							opacity: 1,
							background: theme.palette.primary.light,
						},
					}}
				>
					{menus}
				</List>
			</Collapse>
		</>
	);
	//#endregion
};

CNavCollapse.propTypes = {
	menu: PropTypes.object,
	level: PropTypes.number,
};

export default CNavCollapse;
