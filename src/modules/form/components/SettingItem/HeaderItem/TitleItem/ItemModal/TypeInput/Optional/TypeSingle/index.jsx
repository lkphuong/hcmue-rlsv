import React, { memo } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { CInput } from '_controls/';

const TypeSingle = memo(({ control }) => {
	//#region Data

	//#endregion

	//#region Event
	const handleChangeMark = (CallbackFunc) => (event) => {
		if (event.target.value?.includes('.')) {
			CallbackFunc(event);
		} else {
			if (!isNaN(event.target.value)) {
				CallbackFunc(Number(event.target.value));
			} else {
				CallbackFunc(event.target.value);
			}
		}
	};
	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={12} md={4}>
				<Typography>Điểm</Typography>
			</Grid>
			<Grid item xs={12} md={8}>
				<Controller
					control={control}
					name='mark'
					render={({
						field: { name, onBlur, onChange, ref, value },
						fieldState: { error },
					}) => (
						<CInput
							fullWidth
							inputProps={{
								min: -100,
								max: 100,
								maxLength: 3,
							}}
							placeholder='Điểm'
							name={name}
							inputRef={ref}
							value={value}
							onChange={handleChangeMark(onChange)}
							onBlur={onBlur}
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
			</Grid>
		</>
	);

	//#endregion
});

export default TypeSingle;
