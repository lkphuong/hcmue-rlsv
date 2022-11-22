import React from 'react';

import { List, ListItem } from '@mui/material';

import { Link } from 'react-router-dom';

import { ROUTES } from '_constants/routes';

const ListClasses = ({ data }) => {
	return (
		<List>
			{data.length > 0 &&
				data.map((e, i) => (
					<ListItem key={i}>
						<Link to={`${ROUTES.LIST}/${e.id}`}>{e.name}</Link>
					</ListItem>
				))}
		</List>
	);
};

export default ListClasses;
