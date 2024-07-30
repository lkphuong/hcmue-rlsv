import { memo } from 'react';

import { TableCell, TableRow, Typography } from '@mui/material';

import { convertToASCIIChar } from '_func/';

import Item from './Item';

const Title = memo(({ data, index }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell align='center'>{convertToASCIIChar(index + 97)}</TableCell>
				<TableCell colSpan='100%'>
					<Typography fontWeight={500} fontSize={17}>
						{data?.name}
					</Typography>
				</TableCell>
			</TableRow>

			{data?.items?.length > 0 && data.items.map((e, i) => <Item key={i} data={e} />)}
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
