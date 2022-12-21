import React, { memo } from 'react';
import { Controller } from 'react-hook-form';

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
					<React.Fragment key={i}>
						<Controller
							name={`title_${data.id}.${i}.header_id`}
							defaultValue={headerId}
							render={({ field }) => <input type='hidden' {...field} />}
						/>

						<Item key={i} data={e} headerId={headerId} titleId={data.id} index={i} />
					</React.Fragment>
				))}
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
