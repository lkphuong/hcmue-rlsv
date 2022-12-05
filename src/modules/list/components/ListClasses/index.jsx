import React, { useEffect, useMemo, useState } from 'react';

import { Grid, List, ListItem } from '@mui/material';

import { Link } from 'react-router-dom';

import { ROUTES } from '_constants/routes';

import { ArrowForwardIos } from '@mui/icons-material';

import { splitIntoChunk } from '_func/';

import { CPagination } from '_controls/';

import './index.scss';

const ListClasses = ({ data }) => {
	//#region Data
	const dataPage = useMemo(() => splitIntoChunk(data), [data]);

	const [curData, setCurData] = useState(dataPage.data[1]);

	const [paginate, setPaginate] = useState({ page: 1, pages: dataPage.pages });

	//#endregion

	//#region Event
	const onPageChange = (event, value) => {
		setCurData(dataPage.data[value]);
		setPaginate((prev) => ({ ...prev, page: value }));
	};
	//#endregion

	useEffect(() => {
		setCurData(dataPage.data[1]);
		setPaginate({ page: 1, pages: dataPage.pages });
	}, [dataPage]);

	//#region Render
	return (
		<List>
			{curData.length > 0 &&
				curData.map((e, i) => (
					<Link key={i} to={`${ROUTES.LIST}/${e.id}/class/${e.name}`}>
						<ListItem className='class-item' sx={{ mb: 1 }}>
							<Grid container justifyContent='space-between' alignItems='center'>
								<Grid item>Lớp {e.name}</Grid>
								<Grid item display='flex' alignItems='center'>
									<ArrowForwardIos />
								</Grid>
							</Grid>
						</ListItem>
					</Link>
				))}

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</List>
	);
	//#endregion
};

export default ListClasses;
