import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@mui/material';

import { useLocation, useParams } from 'react-router-dom';

import dayjs from 'dayjs';

import { Form } from '_modules/list/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';

import { actions } from '_slices/mark.slice';

import { CExpired } from '_others/';

const ListDetailPage = () => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);

	const { sheet_id } = useParams();

	const [data, setData] = useState(null);

	const dispatch = useDispatch();

	const location = useLocation();
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		if (!sheet_id) return;
		try {
			const res = await getSheetById(sheet_id);

			if (isSuccess(res)) {
				const { time_department } = res.data;

				if (
					!dayjs().isBetween(
						dayjs(time_department.start),
						dayjs(time_department.end),
						'[]'
					)
				) {
					dispatch(actions.setNotAvailable());
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

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return (
		<Box>
			{!available && (
				<CExpired
					roleName='khoa'
					start={data?.time_department?.start}
					end={data?.time_department?.end}
				/>
			)}

			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{`${data?.user?.fullname} - ${data?.user?.std_code}`}
					</Typography>
				</Paper>
			</Box>

			<Paper className='paper-wrapper'>
				<Box p={1.5}>{data && <Form data={data} status={data?.status} />}</Box>
			</Paper>
		</Box>
	);
	//#endregion
};

export default ListDetailPage;
