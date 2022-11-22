import React, { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Divider, Grid, Typography } from '@mui/material';

import { isSuccess } from '_func/';

import { getItemsByTitleId } from '_api/form.api';
import { getMarks } from '_api/sheets.api';

import Item from './Item';

const Title = memo(({ data, index, sheetId }) => {
	//#region Data
	const [items, setItems] = useState([]);

	const [marks, setMarks] = useState([]);

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

	const getMarkByTitle = useCallback(async () => {
		try {
			const res = await getMarks(sheetId, data?.id);

			if (isSuccess(res)) setMarks(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id, sheetId]);
	//#endregion

	useEffect(() => {
		getItems();
	}, [getItems]);

	useEffect(() => {
		getMarkByTitle();
	}, [getMarkByTitle]);

	//#region Render
	return (
		<>
			<Grid container alignItems='center' spacing={1.2}>
				<Grid item xs={6.4}>
					<Typography
						fontWeight={500}
						fontStyle='oblique'
						sx={{ textDecoration: 'underline' }}
					>
						{data.name}
					</Typography>
				</Grid>

				{items.length > 0 && items.map((e, i) => <Item key={i} data={e} marks={marks} />)}
			</Grid>
			<Divider sx={{ my: 2 }} />
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
