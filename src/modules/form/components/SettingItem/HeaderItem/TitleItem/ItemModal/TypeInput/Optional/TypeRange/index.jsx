import React, { memo } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, Stack, Typography } from '@mui/material';

import { CInput } from '_controls/';

const TypeRange = memo(({ control }) => {
	//#region Data

	//#endregion

	//#region Event
	const handleChangeMark = (CallbackFunc) => (event) => {
		if (!isNaN(event.target.value)) {
			CallbackFunc(Number(event.target.value));
		} else {
			CallbackFunc(event.target.value);
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
				<Stack direction='row' spacing={1.5}>
					<Controller
						control={control}
						name='from_mark'
						render={({
							field: { name, onBlur, onChange, ref, value },
							fieldState: { error },
						}) => (
							<CInput
								placeholder='Min'
								inputProps={{
									min: -100,
									max: 100,
									maxLength: 3,
								}}
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
					<Controller
						control={control}
						name='to_mark'
						render={({
							field: { name, onBlur, onChange, ref, value },
							fieldState: { error },
						}) => (
							<CInput
								placeholder='Max'
								inputProps={{
									min: -100,
									max: 100,
									maxLength: 3,
								}}
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
				</Stack>
			</Grid>
		</>
	);

	//#endregion
});

export default TypeRange;
