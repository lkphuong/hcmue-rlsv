import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Checkbox, Grid, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

const TypeCheckbox = ({ id, mark, unit, initialMark, currentMark }) => {
	//#region Data
	const [score, setScore] = useState(initialMark);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onCheck = (item_id, mark) => (e) => {
		const markObj = {
			item_id: Number(item_id),
			class_mark_level: e.target.checked ? mark : 0,
		};

		setScore(e.target.checked ? mark : 0);
		dispatch(actions.updateMarks(markObj));
	};
	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={2} textAlign='center'>
				<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
					&nbsp;&#40;{`${mark} ${unit}`}
					&#41;&nbsp;
				</Typography>
			</Grid>

			<Grid item xs={1.2} textAlign='center'>
				<Typography>{currentMark.personal_mark_level}</Typography>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Checkbox onChange={onCheck(id, mark)} checked={!!score} />
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Typography>{currentMark.department_mark_level}</Typography>
			</Grid>
		</>
	);
	//#endregion
};

export default TypeCheckbox;
