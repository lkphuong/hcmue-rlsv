import { memo } from 'react';

import { TableCell, TableRow, Typography } from '@mui/material';

import Control from './Control';

const Item = memo(({ data }) => {
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

				<Control data={data} id={Number(data.id)} />
			</TableRow>
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
