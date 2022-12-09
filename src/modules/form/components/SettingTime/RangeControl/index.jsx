import React from 'react';

import { Grid, Stack, Typography } from '@mui/material';

import { MDateStart } from './Start';
import { MDateEnd } from './End';

export const RangeControl = ({ control, label, name }) => {
	//#region Data
	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<Grid item xs={12} xl={4}>
			<Typography mb={0.8} fontWeight={500}>
				{label}
			</Typography>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
				<MDateStart
					control={control}
					name={name}
					beforeCondition={
						name === 'classes' ? 'student' : name === 'department' ? 'classes' : ''
					}
				/>

				<MDateEnd
					control={control}
					name={name}
					beforeCondition={
						name === 'classes' ? 'student' : name === 'department' ? 'classes' : ''
					}
				/>
			</Stack>
		</Grid>
	);
	//#endregion
};
