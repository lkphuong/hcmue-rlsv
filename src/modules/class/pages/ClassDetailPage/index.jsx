import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { Form } from '_modules/class/components';

import { getItemsMarks, getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { actions } from '_slices/mark.slice';

import { CExpired } from '_others/';

import { useReactToPrint } from 'react-to-print';
import { Print } from '@mui/icons-material';

export const ClassMarksContext = createContext();

const ClassDetailPage = () => {
	const ref = useRef();
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);

	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	const [itemsMark, setItemsMark] = useState([]);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const location = useLocation();
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

	const getMarks = useCallback(async () => {
		try {
			const res = await getItemsMarks(data.id);

			if (isSuccess(res)) setItemsMark(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id]);

	const handlePrint = useReactToPrint({
		content: () => {
			return ref.current;
		},
	});

	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

	useEffect(() => {
		getMarks();
	}, [getMarks]);

	useEffect(() => {
		if (data?.status < 3) {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				class_mark_level: e.personal_mark_level,
			}));

			dispatch(actions.renewMarks(payload));
		} else {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				class_mark_level: e.class_mark_level,
			}));

			dispatch(actions.renewMarks(payload));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.status, itemsMark]);

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return data ? (
		<Box>
			<ClassMarksContext.Provider value={{ itemsMark, status: data?.status }}>
				{!available && (
					<CExpired
						roleName='lớp'
						start={data?.time_class?.start}
						end={data?.time_class?.end}
					/>
				)}

				<Box mb={1.5}>
					<Paper className='paper-wrapper'>
						<Stack direction='row' justifyContent='space-between'>
							<Typography fontSize={20} p={1.5} fontWeight={600}>
								{`${data?.user?.fullname} - ${data?.user?.std_code}`}
							</Typography>
							<Button startIcon={<Print />} sx={{ p: 1.5 }} onClick={handlePrint}>
								In phiếu
							</Button>
						</Stack>
					</Paper>
				</Box>

				<Paper className='paper-wrapper'>
					<Box p={1.5}>{data && <Form data={data} status={data?.status} />}</Box>
				</Paper>
			</ClassMarksContext.Provider>
		</Box>
	) : (
		<></>
	);

	//#endregion
};

export default ClassDetailPage;
