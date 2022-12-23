import React, { useCallback, useEffect, useState, useRef, createContext } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import dayjs from 'dayjs';

import { Form } from '_modules/home/components';

import { getItemsMarks, getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { actions } from '_slices/mark.slice';

import { CExpired, CPrintComponent } from '_others/';

import { useResolver } from '_hooks/';

import { validationSchema } from '_modules/home/form';

export const StudentMarksContext = createContext();

const SemesterDetail = () => {
	const ref = useRef();
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);

	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	const [itemsMark, setItemsMark] = useState([]);

	// const resolver = useResolver(validationSchema(data?.headers));

	const methods = useForm();

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

				const { time_student } = res.data;
				if (!dayjs().isBetween(time_student.start, time_student.end, '[]')) {
					dispatch(actions.setNotAvailable());
				}

				setData(res.data);
			}
		} catch (error) {
			throw error;
		}
	}, [sheet_id]);

	const getMarks = useCallback(async () => {
		if (!data?.id) return;

		try {
			const res = await getItemsMarks(data.id);

			if (isSuccess(res))
				setItemsMark(() => {
					return res.data.map((e) => ({ ...e, id: Number(e.id) }));
				});
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
		const payload = itemsMark.map((e) => ({
			item_id: Number(e.item.id),
			personal_mark_level: e.personal_mark_level,
			option_id: Number(e.options?.id) || null,
		}));

		dispatch(actions.renewMarks(payload));
	}, [itemsMark]);

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return data ? (
		<Box>
			<FormProvider {...methods}>
				<StudentMarksContext.Provider value={{ itemsMark }}>
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

					<CPrintComponent data={data} marks={itemsMark} ref={ref} />
				</StudentMarksContext.Provider>
			</FormProvider>
		</Box>
	) : (
		<></>
	);

	//#endregion
};

export default SemesterDetail;
