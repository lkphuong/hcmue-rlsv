import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Checkbox, TableCell, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

const TypeCheckbox = ({ id, mark, unit, initialMark, currentMark, header_id, available }) => {
	//#region Data
	const [score, setScore] = useState(initialMark);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onCheck = (item_id, mark) => (e) => {
		const markObj = {
			item_id: Number(item_id),
			personal_mark_level: e.target.checked ? mark : 0,
			header_id,
		};

		setScore(e.target.checked ? mark : 0);
		dispatch(actions.updateMarks(markObj));
	};
	//#endregion

	//#region Render
	return (
		<>
			<TableCell align='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{`${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</TableCell>

			<TableCell align='center'>
				{available ? (
					<Checkbox onChange={onCheck(id, mark)} checked={!!score} />
				) : (
					<Typography>{currentMark.personal_mark_level} </Typography>
				)}
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.class_mark_level} </Typography>
			</TableCell>
			<TableCell align='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</TableCell>
		</>
	);
	//#endregion
};

export default TypeCheckbox;
