import React, { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Collapse, Grid, IconButton, Stack, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { isSuccess } from '_func/';

import { getTitlesByHeaderId } from '_api/form.api';

import Title from './Title';

const Header = memo(({ data, index, sheetId }) => {
	//#region Data
	const [open, setOpen] = useState(false);

	const [titles, setTitles] = useState([]);

	const navigate = useNavigate();
	//#endregion

	//#region Event
	const toggle = () => setOpen(!open);

	const getTitles = useCallback(async () => {
		if (!data?.id) return navigate(-1);

		try {
			const res = await getTitlesByHeaderId(data.id);

			if (isSuccess(res)) setTitles(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id, navigate]);
	//#endregion

	useEffect(() => {
		getTitles();
	}, [getTitles]);

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
					{titles.length > 0 &&
						titles.map((e, i) => (
							<Title key={i} data={e} sheetId={sheetId} index={i + 1} />
						))}
				</Collapse>
			</Grid>
		</>
	);
	//#endregion
});

Header.displayName = Header;

export default Header;
