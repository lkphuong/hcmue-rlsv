import { useState } from 'react';
import { useLocation } from 'react-router-dom';

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
import { useMemo } from 'react';

const CNavCollapse = ({ menu, level }) => {
	const theme = useTheme();
	const { pathname } = useLocation();

	const selected = useMemo(() => {
		for (let e of menu.children) {
			if (pathname.includes(e.path)) return true;
		}

		return false;
	}, [menu, pathname]);

	const [open, setOpen] = useState(selected || false);

	const handleClick = () => {
		setOpen(!open);
	};

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
							{menu.title}
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
};

CNavCollapse.propTypes = {
	menu: PropTypes.object,
	level: PropTypes.number,
};

export default CNavCollapse;
