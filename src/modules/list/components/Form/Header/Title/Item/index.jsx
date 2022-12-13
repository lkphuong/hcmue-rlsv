import React, { memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Grid, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

import Control from './Control';

const Item = memo(({ data, headerId }) => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);

	const dispatch = useDispatch();
	//#endregion

	//#region Event

	//#endregion

	useEffect(() => {
		dispatch(actions.updateHeaderId({ header_id: Number(headerId), item_id: Number(data.id) }));
	}, [data.id, headerId]);

	//#region Render
	return (
		<>
			<Grid item xs={6.4}>
				<Typography>- {data.content}</Typography>
			</Grid>

			<Control
				id={Number(data.id)}
				min={data.from_mark}
				max={data.to_mark}
				mark={data.mark}
				control={data.control}
				category={data.category}
				unit={data.unit}
				options={data.options || []}
				required={data.required}
				headerId={Number(headerId)}
				available={available}
			/>
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
