import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Grid, Typography } from '@mui/material';

import { CAutocomplete } from '_controls/';

import { actions } from '_slices/mark.slice';

const TypeSelect = ({ item_id, initialMark, currentMark, options, required, header_id }) => {
	//#region Data
	const [score, setScore] = useState(initialMark);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onChangeSelect = (value) => {
		const markObj = {
			item_id,
			personal_mark_level: value?.mark,
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
			<Grid item xs={2} />

			<Grid item xs={1.2} textAlign='center'>
				<CAutocomplete
					disableClearable={required}
					options={options}
					display='mark'
					valueGet='mark'
					value={score}
					onChange={onChangeSelect}
					renderOption={(props, option) => (
						<Box component='li' key={option.id} {...props}>
							{option.content} (<b>{option.mark} Điểm</b>)
						</Box>
					)}
				/>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Typography>{currentMark.class_mark_level || 0}</Typography>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Typography>{currentMark.department_mark_level || 0}</Typography>
			</Grid>
		</>
	);
	//#endregion
};

export default TypeSelect;
