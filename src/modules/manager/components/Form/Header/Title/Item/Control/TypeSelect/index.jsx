import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, TableCell, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { actions } from '_slices/mark.slice';

const TypeSelect = ({
	item_id,
	initialMark,
	currentMark,
	options,
	required,
	header_id,
	available,
}) => {
	//#region Data
	const [score, setScore] = useState(initialMark);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onChangeSelect = (value) => {
		const markObj = {
			item_id,
			department_mark_level: value?.mark,
			option_id: Number(value?.id),
			header_id,
		};

		setScore(value.mark);
		dispatch(actions.updateMarks(markObj));
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell />

			<TableCell align='center'>
				<Typography>{currentMark.personal_mark_level || 0}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level || 0}</Typography>
			</TableCell>
			<TableCell align='center'>
				{available ? (
					<CAutocomplete
						disableClearable={required}
						options={options}
						display='content'
						valueGet='mark'
						value={score}
						onChange={onChangeSelect}
						renderOption={(props, option) => (
							<Box component='li' key={option.id} {...props}>
								{option.content} (<b>{option.mark} Điểm</b>)
							</Box>
						)}
					/>
				) : (
					<Typography>{currentMark.department_mark_level || 0}</Typography>
				)}
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeSelect;
