import React, { useCallback, useEffect, useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { Form } from '_modules/home/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';

const SemesterDetail = () => {
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
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5}>
						{`${data?.semester?.name} - Niên khóa ${data?.academic?.name}`}
					</Typography>
				</Paper>
			</Box>

			<Paper className='paper-wrapper'>
				<Box p={1.5}>{data && <Form data={data} />}</Box>
			</Paper>
		</Box>
	);
	//#endregion
};

export default SemesterDetail;
