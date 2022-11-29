import React, { memo } from 'react';

import { RemoveCircleOutline } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';

const ItemDisplay = memo(({ data }) => {
	return (
		<Grid container alignItems='center' spacing={1}>
			<Grid item xs='auto'>
				<IconButton>
					<RemoveCircleOutline />
				</IconButton>
			</Grid>
			<Grid item xs={true}>
				<Typography>{data.content}</Typography>
			</Grid>
			<Grid item xs={2} md={1}>
				Điểm
			</Grid>
		</Grid>
	);
});

export default ItemDisplay;
