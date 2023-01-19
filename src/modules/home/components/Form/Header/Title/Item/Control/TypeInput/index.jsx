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
	// const onChangeRange = (item_id, min, max) => (e) => {
	// 	if (e.target.value === '') {
	// 		setScore('');
	// 		return;
	// 	} else {
	// 		let value = Number(e.target.value);
	// 		if (isNaN(value)) value = 0;
	// 		if (value > max) value = max;
	// 		if (value < min) value = min;

	// 		const markObj = {
	// 			item_id: Number(item_id),
	// 			personal_mark_level: value,
	// 			header_id,
	// 		};

	// 		setScore(value);
	// 		dispatch(actions.updateMarks(markObj));
	// 	}
	// };

	// const onChangeMark = (item_id, mark) => (e) => {
	// 	if (e.target.value === '') {
	// 		setScore('');
	// 		return;
	// 	} else {
	// 		let value = Number(e.target.value);

	// 		if (isNaN(value)) value = 0;

	// 		const markObj = {
	// 			item_id: Number(item_id),
	// 			personal_mark_level: value,
	// 			header_id,
	// 		};

	// 		setScore(value);
	// 		dispatch(actions.updateMarks(markObj));
	// 	}
	// };

	const handleChange = (CallbackFunc) => (e) => {
		if (e.target.value === '') {
			CallbackFunc('');
			trigger(`title_${titleId}[${index}].personal_mark_level`);
			return;
		}
		CallbackFunc(Number(e.target.value));
		trigger(`title_${titleId}[${index}].personal_mark_level`);
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
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}[${index}].personal_mark_level`}
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
					<Typography>{currentMark.personal_mark_level}</Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.adviser_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeInput;

// <TableCell align='center'>
// 	{available ? (
// 		category === 1 ? (
// 			<CInput
// 				fullWidth
// 				type='number'
// 				inputProps={{ min, max, style: { textAlign: 'center' } }}
// 				onChange={onChangeRange(id, min, max)}
// 				value={score}
// 			/>
// 		) : (
// 			<CInput
// 				fullWidth
// 				type='number'
// 				inputProps={{ step: mark, style: { textAlign: 'center' } }}
// 				onChange={onChangeMark(id, mark)}
// 				value={score}
// 			/>
// 		)
// 	) : (
// 		<Typography>{currentMark.personal_mark_level}</Typography>
// 	)}
// </TableCell>;
