import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { Form } from '_modules/class/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { actions } from '_slices/mark.slice';

import { CExpired } from '_others/';

const ClassDetailPage = () => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);

	const { sheet_id } = useParams();

	const [data, setData] = useState(null);

	const navigate = useNavigate();

	const dispatch = useDispatch();
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

				const { time_class } = res.data;

				if (!dayjs().isBetween(dayjs(time_class.start), dayjs(time_class.end), '[]')) {
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

	//#region Render
	return data ? (
		<Box>
			{!available && (
				<CExpired
					roleName='lớp'
					start={data?.time_class?.start}
					end={data?.time_class?.end}
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
	) : (
		<></>
	);

	//#endregion
};

export default ClassDetailPage;
