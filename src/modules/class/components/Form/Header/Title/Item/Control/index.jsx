import React, { memo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Checkbox, Grid } from '@mui/material';

import { actions } from '_slices/mark.slice';

import { CInput } from '_controls/';

const Control = memo(({ id, min, max, initialMark, control, currentMark }) => {
	//#region Data
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [mark, setMark] = useState(initialMark);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onCheck = (item_id, mark) => (e) => {
		const markObj = {
			item_id,
			class_mark_level: e.target.checked ? mark : 0,
		};

		setMark(e.target.checked ? mark : 0);
		dispatch(actions.updateMarks(markObj));
	};

	const onChange = (item_id, min, max) => (e) => {
		let value = Number(e.target.value);
		if (isNaN(value)) value = 0;
		if (value > max) value = max;
		if (value < min) value = min;

		const markObj = {
			item_id,
			class_mark_level: value,
		};

		setMark(value);
		dispatch(actions.updateMarks(markObj));
	};
	//#endregion

	//#region Render
	return control === 1 ? (
		<>
			<Grid item xs={1.2} textAlign='center'>
				<Checkbox disabled={role_id !== 0} checked={currentMark.personal_mark_level > 0} />
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Checkbox disabled={role_id !== 1} onChange={onCheck(id, min)} checked={!!mark} />
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<Checkbox
					disabled={role_id !== 2}
					checked={currentMark.department_mark_level > 0}
				/>
			</Grid>
		</>
	) : (
		<>
			<Grid item xs={1.2} textAlign='center'>
				<CInput
					disabled={role_id !== 0}
					fullWidth
					type='number'
					inputProps={{ min, max }}
					value={currentMark.personal_mark_level}
				/>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<CInput
					disabled={role_id !== 1}
					fullWidth
					type='number'
					inputProps={{ min, max }}
					onChange={onChange(id, min, max)}
					value={mark}
				/>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				<CInput
					disabled={role_id !== 2}
					fullWidth
					type='number'
					inputProps={{ min, max }}
					value={currentMark.department_mark_level}
				/>
			</Grid>
		</>
	);

	//#endregion
});

export default Control;
