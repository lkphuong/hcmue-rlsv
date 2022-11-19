import React from 'react';

import { NavLink } from 'react-router-dom';

import { List, ListItem } from '@mui/material';

import classNames from 'classnames';

import { NAVIGATIONS } from '_constants/navigations';
import { CPermission } from '_controls/CPermission';
import { FUNCTION_KEY } from '_config/permissions';

import './index.scss';

export const CNavigation = () => {
	return (
		<List className='desktop-nav'>
			{NAVIGATIONS.map((navItem, index) => (
				<CPermission key={index} I={FUNCTION_KEY.READ} a={navItem.entity}>
					<ListItem>
						<NavLink
							to={navItem.path}
							className={({ isActive }) =>
								classNames('nav-item', isActive ? 'tab-actived' : undefined)
							}
						>
							{navItem.name}
						</NavLink>
					</ListItem>
				</CPermission>
			))}
		</List>
	);
};
