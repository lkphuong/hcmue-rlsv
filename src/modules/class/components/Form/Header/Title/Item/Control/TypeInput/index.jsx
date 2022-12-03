import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Grid, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

import { CInput } from '_controls/';

// const validationSchema = yup.object({
// 	mark: yup.number(),
// 	category: yup.number(),
// 	score: yup
// 		.number('Nhập số')
// 		.typeError('Nhập số')
// 		.required('Vui lòng nhập điểm')
// 		.when('category', {
// 			is: (value) => value === 2,
// 			then: yup
// 				.number('Nhập số')
// 				.typeError('Nhập số')
// 				.required('Vui lòng nhập điểm')
// 				.test('wrong', 'Phải là bội số', (value, context) => {
// 					const { parent } = context;

// 					if (value % parent.mark === 0) return true;
// 					else return false;
// 				}),
// 		}),
// });

const TypeInput = ({ id, min, max, mark, category, unit, initialMark, currentMark }) => {
	//#region Data
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [score, setScore] = useState(initialMark);

	// const resolver = useResolver(validationSchema);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onChangeRange = (item_id, min, max) => (e) => {
		let value = Number(e.target.value);

		if (isNaN(value)) value = 0;
		if (value > max) value = max;
		if (value < min) value = min;

		const markObj = {
			item_id: Number(item_id),
			class_mark_level: value,
		};

		setScore(value);
		dispatch(actions.updateMarks(markObj));
	};

	const onChangeMark = (item_id, mark) => (e) => {
		let value = Number(e.target.value);

		if (isNaN(value)) value = 0;

		const markObj = {
			item_id: Number(item_id),
			class_mark_level: value,
		};

		setScore(value);
		dispatch(actions.updateMarks(markObj));
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
				<CInput
					disabled={role_id !== 0}
					fullWidth
					type='number'
					inputProps={{ min, max }}
					value={currentMark.personal_mark_level}
				/>
			</Grid>
			<Grid item xs={1.2} textAlign='center'>
				{category === 1 ? (
					<CInput
						disabled={role_id !== 1}
						fullWidth
						type='number'
						inputProps={{ min, max }}
						onChange={onChangeRange(id, min, max)}
						value={score}
					/>
				) : (
					<CInput
						disabled={role_id !== 1}
						fullWidth
						type='number'
						inputProps={{ step: mark }}
						onChange={onChangeMark(id, mark)}
						value={score}
					/>
				)}
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
};

export default TypeInput;
