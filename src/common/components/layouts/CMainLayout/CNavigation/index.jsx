import React from 'react';

import { NavLink } from 'react-router-dom';

import { List, ListItem } from '@mui/material';

import classNames from 'classnames';

import { NAVIGATIONS } from '_constants/navigations';

import './index.scss';

export const CNavigation = () => {
	return (
		<List className='desktop-nav'>
			{NAVIGATIONS.map((navItem, index) => (
				<ListItem key={index}>
					<NavLink
						to={navItem.path}
						className={({ isActive }) =>
							classNames('nav-item', isActive ? 'tab-actived' : undefined)
						}
					>
						{navItem.name}
					</NavLink>
				</ListItem>
			))}
		</List>
	);
};
