import React, { useCallback, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

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
			<Typography
				borderRadius={1}
				p={2}
				mt={2}
				fontWeight={500}
				fontSize={16}
				sx={{ backgroundColor: 'rgba(0 0 0 / 15%)' }}
			>
				{`${data?.semester?.name} - Niên khóa ${data?.academic?.name}`}
			</Typography>

			<Box mt={1}>{data && <Form data={data} />}</Box>
		</Box>
	);
	//#endregion
};

export default SemesterDetail;
