import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Box, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CDatePicker } from '_controls/';

export const MDateStart = ({ control, name, beforeCondition, disabled }) => {
	//#region Data
	const { resetField, trigger } = useFormContext();

	const before = useWatch({ control, name: beforeCondition })?.end;
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

	const onChangeStartDate = (CallbackFunc) => async (event) => {
		resetField(`${name}.end`, { defaultValue: null });

		if (name !== 'department') {
			resetField('department.start', { defaultValue: null });
			resetField('department.end', { defaultValue: null });
			if (name !== 'classes') {
				resetField('classes.start', { defaultValue: null });
				resetField('classes.end', { defaultValue: null });
			}
		}

		CallbackFunc(event);

		trigger();
	};
	//#endregion

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
						disabled={disabled}
						disablePast
						minDate={dayjs()}
						name={name}
						ref={ref}
						value={value}
						onChange={onChangeStartDate(onChange)}
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
