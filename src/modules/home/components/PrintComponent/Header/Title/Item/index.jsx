import React, { memo } from 'react';

import { TableCell, TableRow, Typography } from '@mui/material';

import Control from './Control';

const Item = memo(({ data, headerId }) => {
	//#region Data

	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell />
				<TableCell>
					<Typography ml={2}>- {data.content}</Typography>
				</TableCell>
			</TableRow>
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;

/* <Control
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
				/>
			 */
