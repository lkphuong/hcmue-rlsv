import React from 'react';

import { Grid, List, ListItem } from '@mui/material';

import { Link } from 'react-router-dom';

import { ROUTES } from '_constants/routes';

import { ArrowForwardIos } from '@mui/icons-material';

import './index.scss';

const ListClasses = ({ data }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<List>
			{data.length > 0 &&
				data.map((e, i) => (
					<Link key={i} to={`${ROUTES.LIST}/${e.id}`}>
						<ListItem className='class-item'>
							<Grid container justifyContent='space-between' alignItems='center'>
								<Grid item>Lớp {e.name}</Grid>
								<Grid item display='flex' alignItems='center'>
									<ArrowForwardIos />
								</Grid>
							</Grid>
						</ListItem>
					</Link>
				))}
		</List>
	);
	//#endregion
};

export default ListClasses;
