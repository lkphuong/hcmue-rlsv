import React, { memo, useCallback, useEffect, useState } from 'react';

import { Collapse, Grid, IconButton, Stack, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { isSuccess } from '_func/';

import { TITLES } from '_modules/home/mocks';

import SubEvaluation from './SubEvaluation';

const Evaluation = memo(({ headerId, data, index }) => {
	// //#region Data
	const [open, setOpen] = useState(false);

	// const [titles, setTitles] = useState([]);
	// //#endregion

	// //#region Event
	const toggle = () => setOpen(!open);

	// const getTitles = useCallback(async () => {
	// 	if (!headerId) return;
	// 	try {
	// 		const res = await getTitles(headerId);

	// 		if (isSuccess(res)) setTitles(res.data);
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }, [headerId]);
	// //#endregion

	// useEffect(() => {
	// 	getTitles();
	// }, [getTitles]);

	//#region Render
	return (
		<>
			<Grid
				item
				xs={1}
				textAlign='center'
				display='flex'
				alignItems='center'
				justifyContent='center'
				fontWeight={600}
			>
				{index}
			</Grid>
			<Grid item xs={11}>
				<Stack direction='row' justifyContent='space-between' alignItems='center'>
					<Typography fontWeight={600} fontStyle='italic'>{`${data.name}`}</Typography>
					<IconButton onClick={toggle}>
						{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
					</IconButton>
				</Stack>

				<Collapse in={open} timeout='auto'>
					{TITLES.length > 0 &&
						TITLES.map((e, i) => <SubEvaluation key={i} data={e} index={i + 1} />)}
				</Collapse>
			</Grid>
		</>
	);
	//#endregion
});

Evaluation.displayName = Evaluation;

export default Evaluation;
