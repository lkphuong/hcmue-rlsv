import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Grid, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

import { CInput } from '_controls/';

const TypeInput = ({ id, min, max, mark, category, unit, initialMark, currentMark, header_id }) => {
	//#region Data
	const [score, setScore] = useState(initialMark);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onChangeRange = (item_id, min, max) => (e) => {
		if (e.target.value === '') {
			setScore('');
			return;
		} else {
			let value = Number(e.target.value);

			if (isNaN(value)) value = 0;
			if (value > max) value = max;
			if (value < min) value = min;

			const markObj = {
				item_id: Number(item_id),
				department_mark_level: value,
				header_id,
			};

			setScore(value);
			dispatch(actions.updateMarks(markObj));
		}
	};

	const onChangeMark = (item_id, mark) => (e) => {
		if (e.target.value === '') {
			setScore('');
			return;
		} else {
			let value = Number(e.target.value);

			if (isNaN(value)) value = 0;

			const markObj = {
				item_id: Number(item_id),
				department_mark_level: value,
				header_id,
			};

			setScore(value);
			dispatch(actions.updateMarks(markObj));
		}
	};
	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={2} textAlign='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{category === 1 ? `Từ ${min} đến ${max} ${unit}` : `${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Typography>{currentMark.personal_mark_level}</Typography>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Typography>{currentMark.class_mark_level}</Typography>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				{category === 1 ? (
					<CInput
						fullWidth
						type='number'
						inputProps={{ min, max }}
						onChange={onChangeRange(id, min, max)}
						value={score}
					/>
				) : (
					<CInput
						fullWidth
						type='number'
						inputProps={{ step: mark }}
						onChange={onChangeMark(id, mark)}
						value={score}
					/>
				)}
			</Grid>
		</>
	);
	//#endregion
};

export default TypeInput;
