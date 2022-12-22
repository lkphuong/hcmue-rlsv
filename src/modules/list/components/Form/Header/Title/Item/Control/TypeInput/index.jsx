import { Controller, useFormContext } from 'react-hook-form';

import { TableCell, Typography } from '@mui/material';

import { CInput } from '_controls/';

const TypeInput = ({
	min,
	max,
	mark,
	category,
	unit,
	initialMark,
	currentMark,
	titleId,
	index,
	available,
}) => {
	//#region Data
	const { control, trigger } = useFormContext();
	//#endregion

	//#region Event
	const handleChange = (CallbackFunc) => (e) => {
		if (e.target.value === '') {
			CallbackFunc('');
			trigger(`title_${titleId}[${index}].department_mark_level`);
			return;
		}
		CallbackFunc(Number(e.target.value));
		trigger(`title_${titleId}[${index}].department_mark_level`);
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{category === 1 ? `Từ ${min} đến ${max} ${unit}` : `${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>

			<TableCell align='center'>
				<Typography>{currentMark.personal_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}[${index}].department_mark_level`}
						defaultValue={initialMark}
						render={({
							field: { name, onChange, ref, value },
							fieldState: { error },
						}) => (
							<CInput
								fullWidth
								type='number'
								// inputProps={{ min, max, style: { textAlign: 'center' } }}
								name={name}
								ref={ref}
								value={value}
								onChange={handleChange(onChange)}
								error={!!error}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.department_mark_level}</Typography>
				)}
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeInput;
