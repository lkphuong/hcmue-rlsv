import React, { memo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { RemoveCircleOutline } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';

import { alert } from '_func/alert';

const ItemDisplay = memo(({ data }) => {
	//#region Data
	const form_id = useSelector((state) => state.form.form_id, shallowEqual);

	console.log(data);
	//#endregion

	//#region Event
	const handleDeleteItem = async () => {
		alert.warningDelete({ onConfirm: () => console.log('Đồng ý xóa') });
	};
	//#endregion

	//#region Render
	//#endregion

	return (
		<Grid container alignItems='center' spacing={1}>
			<Grid item xs='auto'>
				<IconButton onClick={handleDeleteItem}>
					<RemoveCircleOutline />
				</IconButton>
			</Grid>
			<Grid item xs={true}>
				<Typography>{data.content}</Typography>
			</Grid>
			<Grid item xs={3} md={2} textAlign='center'>
				{data.unit}
			</Grid>
		</Grid>
	);
});

export default ItemDisplay;
