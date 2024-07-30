import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Box, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { CDatePicker } from '_controls/';

export const MDateEnd = ({ control, name, beforeCondition, disabled }) => {
	//#region Data
	const { resetField, trigger } = useFormContext();

	const start = useWatch({ control, name })?.start;
	const before = useWatch({ control, name: beforeCondition })?.end;
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

	const onChangeEndDate = (CallbackFunc) => (event) => {
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
						disabled={disabled}
						disablePast
						minDate={dayjs()}
						name={name}
						ref={ref}
						value={value}
						onChange={onChangeEndDate(onChange)}
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
