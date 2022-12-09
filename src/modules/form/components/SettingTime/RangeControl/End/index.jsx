import React, { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Box, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CDatePicker } from '_controls/';

export const MDateEnd = ({ control, name, beforeCondition }) => {
	//#region Data
	const { resetField } = useFormContext();

	const start = useWatch({ control, name })?.start;
	const before = useWatch({ control, name: beforeCondition })?.end;
	const _before = useWatch({ control, name: beforeCondition });
	//#endregion

	//#region Event
	const shouldDisableDate = (date) => {
		if (!beforeCondition)
			return (
				dayjs(date).isSame(dayjs(), 'date') ||
				dayjs(date).isBefore(dayjs(start)) ||
				dayjs(date).isSame(dayjs(start), 'date')
			);
		else
			return (
				dayjs(date).isSame(dayjs(), 'date') ||
				dayjs(date).isBefore(dayjs(start)) ||
				dayjs(date).isBefore(dayjs(before)) ||
				dayjs(date).isSame(dayjs(before), 'date') ||
				dayjs(date).isSame(dayjs(start), 'date')
			);
	};
	//#endregion

	useEffect(() => {
		if (!_before) return;
		else {
			resetField(`${[name]}.end`);
		}
	}, [_before]);

	//#region Render
	return (
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
						disablePast
						minDate={dayjs()}
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
	);
	//#endregion
};
