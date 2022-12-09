import React, { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
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
		<Accordion sx={{ width: '100%' }} expanded={open} onChange={toggle}>
			<AccordionSummary sx={{ p: 0, '& .MuiAccordionSummary-content': { margin: 0 } }}>
				<Grid
					item
					xs={1}
					textAlign='center'
					display='flex'
					alignItems='center'
					justifyContent='center'
					fontWeight={600}
					sx={{ backgroundColor: 'rgb(206 206 206 / 20%)' }}
				>
					{index}
				</Grid>

				<Grid item xs={11} sx={{ backgroundColor: 'rgb(206 206 206 / 20%)' }}>
					<Grid container alignItems='center' spacing={1}>
						<Grid item xs={6.4}>
							<Typography fontWeight={600} fontSize={20}>{`${data.name}`}</Typography>
						</Grid>
						<Grid item xs={2} textAlign='center'>
							<Typography>Tối đa {data?.max_mark} điểm</Typography>
						</Grid>

						<Grid item xs={true} textAlign='right'>
							<IconButton onClick={toggle}>
								{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
			</AccordionSummary>

			<AccordionDetails sx={{ p: 0 }}>
				<Grid container>
					{titles.length > 0 &&
						titles.map((e, i) => (
							<Title
								key={i}
								data={e}
								sheetId={sheetId}
								index={i + 1}
								headerId={data.id}
							/>
						))}
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
	//#endregion
});

Header.displayName = Header;

export default Header;
