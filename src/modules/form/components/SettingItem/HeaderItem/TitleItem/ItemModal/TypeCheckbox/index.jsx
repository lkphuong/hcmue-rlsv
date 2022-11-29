import React, { memo } from 'react';

import { Grid, Typography } from '@mui/material';

import { Controller, useController } from 'react-hook-form';

import { CInput } from '_controls/';

const TypeCheckbox = memo(({ control }) => {
	//#region Data
	const {
		field: { onChange },
	} = useController({ control, name: 'to_mark', rules: { required: true } });
	//#endregion

	//#region Event
	const handleChangeMark = (CallbackFunc) => (event) => {
		if (!isNaN(event.target.value)) {
			CallbackFunc(Number(event.target.value));
			onChange(Number(event.target.value));
		} else {
			CallbackFunc(event.target.value);
			onChange(event.target.value);
		}
	};
	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={12} md={3}>
				<Typography>Điểm</Typography>
			</Grid>
			<Grid item xs={12} md={9}>
				<Controller
					control={control}
					name='from_mark'
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

export default TypeCheckbox;
