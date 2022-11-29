import React, { memo } from 'react';

import { Grid, Stack, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CInput, CSelect } from '_controls/';

import { CATEGORY } from '_constants/variables';

const TypeInput = memo(({ control }) => {
	//#region Data
	//#endregion

	//#region Event
	const handleChangeMark = (CallbackFunc) => (value) => {
		if (!isNaN(value)) CallbackFunc(Number(value));
		else CallbackFunc(value);
	};
	//#endregion

	//#region Render

	return (
		<>
			<Grid item xs={12} md={3}>
				<Typography>Điểm</Typography>
			</Grid>
			<Grid item xs={12} md={9}>
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

			<Grid item xs={12} md={3}>
				<Typography>Loại điểm</Typography>
			</Grid>
			<Grid item xs={12} md={9}>
				<Controller
					control={control}
					name='category'
					render={({ field: { name, onChange, value } }) => (
						<CSelect
							value={value}
							options={CATEGORY}
							onChange={onChange}
							name={name}
							fullWidth
						/>
					)}
				/>
			</Grid>

			<Grid item xs={12} md={3}>
				<Typography>Đơn vị</Typography>
			</Grid>
			<Grid item xs={12} md={9}>
				<Controller
					control={control}
					name='unit'
					render={({
						field: { name, onBlur, onChange, ref, value },
						fieldState: { error },
					}) => (
						<CInput
							value={value}
							inputRef={ref}
							onChange={onChange}
							onBlur={onBlur}
							name={name}
							fullWidth
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

export default TypeInput;
