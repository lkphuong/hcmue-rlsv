import React, { memo, useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Grid, Stack, Typography } from '@mui/material';

import { CInput } from '_controls/';

const TypeRange = memo(({ control }) => {
	//#region Data
	const minValue = useWatch({ control, name: 'from_mark' });
	const maxValue = useWatch({ control, name: 'to_mark' });

	const { trigger } = useFormContext();
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

	useEffect(() => {
		trigger(['from_mark', 'to_mark']);
	}, [minValue, maxValue]);

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
									maxLength: 5,
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
									maxLength: 5,
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
