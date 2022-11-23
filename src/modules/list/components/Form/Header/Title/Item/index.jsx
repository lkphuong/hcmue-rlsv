import React, { memo, useMemo } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Checkbox, Grid, Typography } from '@mui/material';

import { CInput } from '_controls/';

import { actions } from '_slices/mark.slice';

const Item = memo(({ data, marks }) => {
	//#region Data
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const roleId = useMemo(() => {
		if (role_id === undefined || role_id === null) return null;
		return role_id;
	}, [role_id]);

	const dispatch = useDispatch();

	const currentMark = useMemo(() => {
		if (!marks?.length)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				department_mark_level: 0,
			};

		// eslint-disable-next-line eqeqeq
		const foundItem = marks.find((e) => e.item.id == data.id);

		if (!foundItem)
			return {
				personal_mark_level: 0,
				class_mark_level: 0,
				department_mark_level: 0,
			};

		return {
			personal_mark_level: foundItem.personal_mark_level,
			class_mark_level: foundItem.class_mark_level,
			department_mark_level: foundItem.department_mark_level,
		};
	}, [data?.id, marks]);
	//#endregion

	//#region Event
	const onCheck = (item_id, mark) => (e) => {
		const markObj = {
			item_id,
			department_mark_level: e.target.checked ? mark : 0,
		};

		dispatch(actions.updateMarks(markObj));
	};

	const onKeyUp = (item_id, min, max) => (e) => {
		const value = Number(e.target.value);
		if (isNaN(value)) e.target.value = 0;
		if (value > max) e.target.value = max;
		if (value < min) e.target.value = min;

		const markObj = {
			item_id,
			department_mark_level: Number(e.target.value),
		};

		dispatch(actions.updateMarks(markObj));
	};
	//#endregion

	//#region Render
	return (
		<>
			<Grid item xs={6.4}>
				<Typography>- {data.content}</Typography>
			</Grid>

			<Grid item xs={2} textAlign='center'>
				{!data.category ? (
					<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
						&nbsp;&#40;{`${data.from_mark}${data?.unit ? ` ${data.unit}` : ''}`}
						&#41;&nbsp;
					</Typography>
				) : (
					<Typography component='span' whiteSpace='nowrap' fontWeight={500}>
						&nbsp;&#40;
						{`Từ ${data.from_mark} đến ${data.to_mark} ${data.unit ? data.unit : ''}`}
						&#41;&nbsp;
					</Typography>
				)}
			</Grid>

			{data.control === 1 ? (
				<>
					<Grid item xs={1.2} textAlign='center'>
						<Checkbox
							disabled={roleId !== 0}
							onChange={onCheck(data.id, data.from_mark)}
							checked={currentMark.personal_mark_level > 0}
						/>
					</Grid>
					<Grid item xs={1.2} textAlign='center'>
						<Checkbox
							disabled={roleId !== 1}
							onChange={onCheck(data.id, data.from_mark)}
							checked={currentMark.class_mark_level > 0}
						/>
					</Grid>
					<Grid item xs={1.2} textAlign='center'>
						<Checkbox
							disabled={roleId !== 2}
							onChange={onCheck(data.id, data.from_mark)}
						/>
					</Grid>
				</>
			) : (
				<>
					<Grid item xs={1.2} textAlign='center'>
						<CInput
							disabled={roleId !== 0}
							fullWidth
							type='number'
							inputProps={{
								min: data?.from_mark,
								max: data?.to_mark,
							}}
							onKeyUp={onKeyUp(data.id, data?.from_mark, data?.to_mark)}
							value={currentMark.personal_mark_level}
						/>
					</Grid>
					<Grid item xs={1.2} textAlign='center'>
						<CInput
							disabled={roleId !== 1}
							fullWidth
							type='number'
							inputProps={{
								min: data?.from_mark,
								max: data?.to_mark,
							}}
							onKeyUp={onKeyUp(data.id, data?.from_mark, data?.to_mark)}
							value={currentMark.class_mark_level}
						/>
					</Grid>
					<Grid item xs={1.2} textAlign='center'>
						<CInput
							disabled={roleId !== 2}
							fullWidth
							type='number'
							inputProps={{
								min: data?.from_mark,
								max: data?.to_mark,
							}}
							onKeyUp={onKeyUp(data.id, data?.from_mark, data?.to_mark)}
						/>
					</Grid>
				</>
			)}
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
