import React, { memo } from 'react';

import { Grid, Typography } from '@mui/material';

import Control from './Control';

const Item = memo(({ data }) => {
	//#region Data

	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={6.4}>
				<Typography>- {data.content}</Typography>
			</Grid>

			<Control
				id={data.id}
				min={data.from_mark}
				max={data.to_mark}
				mark={data.mark}
				control={data.control}
				category={data.category}
				unit={data.unit}
				options={data.options || []}
			/>
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
