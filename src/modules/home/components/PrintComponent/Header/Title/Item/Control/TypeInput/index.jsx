import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {  TableCell, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

import { CInput } from '_controls/';

const TypeInput = ({
	id,
	min,
	max,
	mark,
	category,
	unit,
	initialMark,
	currentMark,
	header_id,
	available,
}) => {
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
				personal_mark_level: value,
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
				personal_mark_level: value,
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
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{category === 1 ? `Từ ${min} đến ${max} ${unit}` : `${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>
			<TableCell align='center'>
				{available ? (
					category === 1 ? (
						<CInput
							fullWidth
							type='number'
							inputProps={{ min, max, style: { textAlign: 'center' } }}
							onChange={onChangeRange(id, min, max)}
							value={score}
						/>
					) : (
						<CInput
							fullWidth
							type='number'
							inputProps={{ step: mark, style: { textAlign: 'center' } }}
							onChange={onChangeMark(id, mark)}
							value={score}
						/>
					)
				) : (
					<Typography>{currentMark.personal_mark_level}</Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level}</Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>

		</>
	);
	//#endregion
};

export default TypeInput;
