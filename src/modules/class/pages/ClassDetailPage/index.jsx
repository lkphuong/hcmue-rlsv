import React, { useCallback, useEffect, useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { Form } from '_modules/class/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';

const ClassDetailPage = () => {
	//#region Data
	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		if (!sheet_id) return;
		try {
			const res = await getSheetById(sheet_id);

			if (isSuccess(res)) setData(res.data);
		} catch (error) {
			throw error;
		}
	}, [sheet_id]);
	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

	//#region Render
	return (
		<Box>
			<Typography
				borderRadius={1}
				p={2}
				mb={2}
				fontWeight={700}
				fontSize={20}
				sx={{ backgroundColor: 'rgba(0 0 0 / 15%)' }}
			>
				{`${data?.user?.fullname} - ${data?.user?.std_code}`}
			</Typography>

			<Paper className='paper-wrapper'>
				<Box p={1.5}>{data && <Form data={data} status={data?.status} />}</Box>
			</Paper>
		</Box>
	);
	//#endregion
};

export default ClassDetailPage;
