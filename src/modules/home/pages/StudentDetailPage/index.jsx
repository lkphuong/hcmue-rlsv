import React, { useCallback, useEffect, useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { Form, PrintComponent } from '_modules/home/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { actions } from '_slices/mark.slice';

import { CExpired } from '_others/';
import { Print } from '@mui/icons-material';

import { useReactToPrint } from 'react-to-print';

const SemesterDetail = () => {
	const ref = useRef();
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

				const { time_student } = res.data;

				if (!dayjs().isBetween(dayjs(time_student.start), dayjs(time_student.end), '[]')) {
					dispatch(actions.setNotAvailable());
				}

				setData(res.data);
			}
		} catch (error) {
			throw error;
		}
	}, [sheet_id]);

	const handlePrint = useReactToPrint({
		content: () => {
			return ref.current;
		},
	});
	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

	//#region Render
	return data ? (
		<Box>
			{!available && (
				<CExpired
					roleName='sinh viên'
					start={data?.time_student?.start}
					end={data?.time_student?.end}
				/>
			)}
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Stack direction='row' justifyContent='space-between'>
						<Typography fontSize={20} p={1.5} fontWeight={600}>
							{`${data?.semester?.name} - Niên khóa ${data?.academic?.name}`}
						</Typography>
						<Button startIcon={<Print />} sx={{ p: 1.5 }} onClick={handlePrint}>
							In phiếu
						</Button>
					</Stack>
				</Paper>
			</Box>
			<Paper className='paper-wrapper'>
				<Box p={1.5}>{data && <Form data={data} />}</Box>
			</Paper>
			<PrintComponent data={data} ref={ref} />;
		</Box>
	) : (
		<></>
	);

	//#endregion
};

export default SemesterDetail;
