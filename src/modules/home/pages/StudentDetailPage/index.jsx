import React, { useCallback, useEffect, useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';

import { Form } from '_modules/home/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

const SemesterDetail = () => {
	//#region Data
	const { sheet_id } = useParams();

	const [data, setData] = useState(null);

	const navigate = useNavigate();
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		if (!sheet_id) return;
		try {
			const res = await getSheetById(sheet_id);

			if (isSuccess(res)) {
				if (res.data === null) {
					alert.fail({
						text: 'Tài khoản này không thuộc sinh viên để chấm điểm cá nhân.',
					});
					navigate(-1);
				}
				setData(res.data);
			}
		} catch (error) {
			throw error;
		}
	}, [sheet_id]);
	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

	//#region Render
	return data ? (
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
	) : (
		<></>
	);

	//#endregion
};

export default SemesterDetail;
