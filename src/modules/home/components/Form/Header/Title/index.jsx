import React, { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Box, Grid, Typography } from '@mui/material';

import { isSuccess } from '_func/';

import { getItemsByTitleId } from '_api/form.api';

import Item from './Item';

const Title = memo(({ data, headerId }) => {
	//#region Data
	const [items, setItems] = useState([]);

	const navigate = useNavigate();
	//#endregion

	//#region Event
	const getItems = useCallback(async () => {
		if (!data?.id) return navigate(-1);

		try {
			const res = await getItemsByTitleId(data.id);

			if (isSuccess(res)) setItems(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id, navigate]);
	//#endregion

	useEffect(() => {
		getItems();
	}, [getItems]);

	//#region Render
	return (
		<>
			<Grid item xs={1} />
			<Grid item xs={11} padding='10px'>
				<Grid container alignItems='center' spacing={1.2}>
					<Grid item xs={12} borderBottom='1px solid rgb(0 0 0 / 20%)'>
						<Box>
							<Typography fontWeight={500} fontStyle='oblique' fontSize={16}>
								{data.name}
							</Typography>
						</Box>
					</Grid>

					{items.length > 0 &&
						items.map((e, i) => <Item key={i} data={e} headerId={headerId} />)}
				</Grid>
			</Grid>
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
