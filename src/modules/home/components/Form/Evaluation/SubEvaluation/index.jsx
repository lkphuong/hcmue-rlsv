import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Checkbox, Divider, Grid, TextField, Typography } from '@mui/material';

import { isSuccess } from '_func/';

import { ITEMS_DEMO_1, ITEMS_DEMO_2, ITEMS_DEMO_3 } from '_modules/home/mocks';

import { actions } from '_slices/mark.slice';

import { CInput } from '_controls/';

const SubEvaluation = memo(({ data, index }) => {
	// //#region Data
	useEffect(() => {
		window.addEventListener('beforeunload', alertUser);
		return () => {
			window.removeEventListener('beforeunload', alertUser);
		};
	}, []);

	const alertUser = (e) => {
		e.preventDefault();
		e.returnValue = '';
	};

	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const roleId = useMemo(() => {
		if (role_id === undefined || role_id === null) return null;
		return role_id;
	}, [role_id]);

	const dispatch = useDispatch();
	// const [items, setItems] = useState([]);

	// //#endregion

	// //#region Event
	// const getItems = useCallback(async () => {
	// 	if (!data?.id) return;

	// 	try {
	// 		const res = await getItems(data.id);

	// 		if (isSuccess(res)) setItems(res.data);
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }, [data]);

	const onCheck = (item_id, mark) => (e) => {
		const markObj = {
			item_id,
			personal_mark_level: e.target.checked ? mark : 0,
		};

		dispatch(actions.updateMarks(markObj));
	};

	// const onChange = (item_id) => (e) => {
	// 	let value = 0;
	// 	value = Number(e.target.value);
	// 	if (isNaN(value)) value = 0;

	// 	console.log(value);

	// };

	const onKeyUp = (item_id, min, max) => (e) => {
		const value = Number(e.target.value);
		if (isNaN(value)) e.target.value = 0;
		if (value > max) e.target.value = max;
		if (value < min) e.target.value = min;

		const markObj = {
			item_id,
			personal_mark_level: Number(e.target.value),
		};

		dispatch(actions.updateMarks(markObj));
	};
	// //#endregion

	// useEffect(() => {
	// 	getItems();
	// }, [getItems]);

	//#region Render
	return (
		<>
			<Grid container alignItems='center' spacing={1.2}>
				<Grid item xs={6.4}>
					<Typography
						fontWeight={500}
						fontStyle='oblique'
						sx={{ textDecoration: 'underline' }}
					>
						{data.name}
					</Typography>
				</Grid>

				{index === 1 &&
					ITEMS_DEMO_1.length > 0 &&
					ITEMS_DEMO_1.map((e, i) => (
						<>
							<Grid item xs={6.4}>
								<Typography>- {e.content}</Typography>
							</Grid>

							<Grid item xs={2} textAlign='center'>
								{!e.category ? (
									<Typography
										component='span'
										whiteSpace='nowrap'
										fontWeight={500}
									>
										&nbsp;&#40;{e.from_mark + ' ' + e.unit}&#41;&nbsp;
									</Typography>
								) : (
									<Typography
										component='span'
										whiteSpace='nowrap'
										fontWeight={500}
									>
										&nbsp;&#40;{`Từ ${e.from_mark} đến ${e.to_mark} ${e.unit}`}
										&#41;&nbsp;
									</Typography>
								)}
							</Grid>

							{e.control === 1 ? (
								<>
									<Grid item xs={1.2} textAlign='center'>
										<Checkbox
											onChange={onCheck(e.id, e.from_mark)}
											disabled={roleId !== 0}
										/>
									</Grid>
									<Grid item xs={1.2} textAlign='center'>
										<Checkbox disabled={roleId !== 1} />
									</Grid>
									<Grid item xs={1.2} textAlign='center'>
										<Checkbox disabled={roleId !== 2} />
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
												min: e?.from_mark,
												max: e?.to_mark,
											}}
											onKeyUp={onKeyUp(e.id, e?.from_mark, e?.to_mark)}
										/>
									</Grid>
									<Grid item xs={1.2} textAlign='center'>
										<CInput disabled={roleId !== 1} />
									</Grid>
									<Grid item xs={1.2} textAlign='center'>
										<CInput disabled={roleId !== 2} />
									</Grid>
								</>
							)}
						</>
					))}
			</Grid>
			<Divider sx={{ my: 2 }} />
		</>
	);
	//#endregion
});

export default SubEvaluation;
