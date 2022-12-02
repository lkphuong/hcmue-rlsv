import React from 'react';
import { Controller } from 'react-hook-form';

import { Box, Grid, Stack, Typography } from '@mui/material';

import { CDatePicker } from '_controls/';

export const RangeControl = ({ control, label, name, shouldDisableDate }) => {
	return (
		<Grid item xs={12} xl={4}>
			<Typography mb={0.8} fontWeight={500}>
				{label}
			</Typography>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
				<Box>
					<Typography mb={0.8} fontWeight={500}>
						Bắt đầu
					</Typography>
					<Controller
						control={control}
						name={`${name}.start`}
						render={({
							field: { onChange, onBlur, name, ref, value },
							fieldState: { error },
						}) => (
							<CDatePicker
								name={name}
								inputRef={ref}
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								error={!!error}
								helperText={error?.message}
								shouldDisableDate={shouldDisableDate}
							/>
						)}
					/>
				</Box>
				<Box>
					<Typography mb={0.8} fontWeight={500}>
						Kết thúc
					</Typography>
					<Controller
						control={control}
						name={`${name}.end`}
						render={({
							field: { onChange, onBlur, name, ref, value },
							fieldState: { error },
						}) => (
							<CDatePicker
								name={name}
								inputRef={ref}
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								error={!!error}
								helperText={error?.message}
								shouldDisableDate={shouldDisableDate}
							/>
						)}
					/>
				</Box>
			</Stack>
		</Grid>
	);
};
