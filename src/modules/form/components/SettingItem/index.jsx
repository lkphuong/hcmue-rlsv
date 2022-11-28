import React, { memo } from 'react';

import { Button, Grid } from '@mui/material';

const SettingItem = memo(({ updateStep }) => {
	//#region Data
	//#endregion

	//#region Event
	const handleBack = () => updateStep((prev) => prev - 1);
	//#endregion

	//#region Render
	return (
		<Grid container mt={4} spacing={2} alignItems='center' justifyContent='center'>
			<Grid item>
				<Button
					sx={{ maxWidth: 100 }}
					type='button'
					variant='contained'
					onClick={handleBack}
				>
					Trở lại
				</Button>
			</Grid>
			<Grid item>
				<Button
					sx={{ maxWidth: 150 }}
					type='submit'
					variant='contained'
					onClick={() => updateStep((prev) => prev + 1)}
				>
					Hoàn thành
				</Button>
			</Grid>
		</Grid>
	);
	//#endregion
});

export default SettingItem;
