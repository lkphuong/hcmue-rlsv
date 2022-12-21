import React, { memo } from 'react';

import { TableCell, TableRow, Typography } from '@mui/material';

import Item from './Item';

const Title = memo(({ data, headerId }) => {
	//#region Data

	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell />
				<TableCell colSpan='100%'>
					<Typography fontWeight={500} fontSize={17}>
						{data?.name}
					</Typography>
				</TableCell>
			</TableRow>

			{data?.items?.length > 0 &&
				data.items.map((e, i) => (
					<Item
						key={i}
						data={e}
						headerId={headerId}
						titleId={Number(data.id)}
						index={i}
					/>
				))}
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
