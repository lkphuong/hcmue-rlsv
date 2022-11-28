import React, { memo } from 'react';
import { useWatch } from 'react-hook-form';

import { AddCircleOutline, CheckCircleOutline } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';

const CheckButton = memo(({ control, name, onSubmit }) => {
	//#region Data
	const currentValue = useWatch({ control, name });
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	//#endregion
	return (
		<Grid item xs='auto'>
			{currentValue === '' ? (
				<IconButton>
					<AddCircleOutline />
				</IconButton>
			) : (
				<IconButton onClick={onSubmit} color='success'>
					<CheckCircleOutline />
				</IconButton>
			)}
		</Grid>
	);
});

export default CheckButton;
