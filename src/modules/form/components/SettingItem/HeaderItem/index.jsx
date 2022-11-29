import React, { memo, useEffect, useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { getTitlesByHeaderId } from '_api/form.api';

import { isSuccess } from '_func/';

import TitleItem from './TitleItem';

const HeaderItem = memo(({ data }) => {
	//#region Data
	const [titles, setTitles] = useState([]);

	const { id: header_id } = data;
	//#endregion

	//#region Event
	const getTitles = async () => {
		if (!header_id) return;

		const res = await getTitlesByHeaderId(header_id);

		if (isSuccess(res)) setTitles(res.data);
	};
	//#endregion

	useEffect(() => {
		getTitles();
	}, [data?.id]);

	//#region Render
	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography fontWeight={600}>
					{data.name}
					<Typography component='span'>&nbsp;(Tối đa {data.max_mark} điểm)</Typography>
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{titles.length > 0 &&
					titles.map((title) => <TitleItem key={title.id} data={title} />)}
			</AccordionDetails>
		</Accordion>
	);

	//#endregion
});

export default HeaderItem;
