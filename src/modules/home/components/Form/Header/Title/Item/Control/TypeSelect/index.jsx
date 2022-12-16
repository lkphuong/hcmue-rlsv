import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, TableCell, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { actions } from '_slices/mark.slice';
import { Controller, useFormContext } from 'react-hook-form';

const TypeSelect = ({
	item_id,
	initialMark,
	currentMark,
	options,
	required,
	header_id,
	available,
	titleId,
	index,
}) => {
	//#region Data
	const [score, setScore] = useState(initialMark);

	const { control, resetField } = useFormContext();

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	// const onChangeSelect = (value) => {
	// 	const markObj = {
	// 		item_id,
	// 		personal_mark_level: value?.mark,
	// 		option_id: Number(value?.id),
	// 		header_id,
	// 	};

	// 	setScore(value.mark);
	// 	dispatch(actions.updateMarks(markObj));
	// };

	const onChangeSelect = (CallbackFunc) => (option) => {
		CallbackFunc(option?.mark);
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell />
			<TableCell align='center'>
				{available ? (
					<Controller
						control={control}
						name={`title_${titleId}.${index}.personal_mark_level`}
						defaultValue={initialMark}
						render={({ field: { value, onChange, ref } }) => (
							<CAutocomplete
								ref={ref}
								disableClearable={required}
								options={options}
								display='mark'
								valueGet='mark'
								// value={score}
								// onChange={onChangeSelect}
								value={value}
								onChange={onChangeSelect(onChange)}
								renderOption={(props, option) => (
									<Box component='li' key={option.id} {...props}>
										{option.content} (<b>{option.mark} Điểm</b>)
									</Box>
								)}
							/>
						)}
					/>
				) : (
					<Typography>{currentMark.personal_mark_level || 0}</Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level || 0}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level || 0}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeSelect;
