import React, { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Box, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CDatePicker } from '_controls/';

export const MDateStart = ({ control, name, beforeCondition }) => {
	//#region Data
	const { resetField } = useFormContext();

	const before = useWatch({ control, name: beforeCondition })?.end;
	const _before = useWatch({ control, name: beforeCondition });
	//#endregion

	//#region Event
	const shouldDisableDate = (date) => {
		if (!beforeCondition) return dayjs(date).isSame(dayjs(), 'date');
		else
			return (
				dayjs(date).isSame(dayjs(), 'date') ||
				dayjs(date).isBefore(dayjs(before)) ||
				dayjs(date).isSame(dayjs(before), 'date')
			);
	};
	//#endregion

	useEffect(() => {
		if (!_before) return;
		else {
			resetField(`${[name]}.start`);
		}
	}, [_before]);

	//#region Render
	return (
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
