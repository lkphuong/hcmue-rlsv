import React, { useCallback, useEffect, useState, useRef, createContext } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import dayjs from 'dayjs';

import { Form } from '_modules/list/components';

import { getItemsMarks, getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';

import { actions } from '_slices/mark.slice';

import { CExpired, CPrintComponent } from '_others/';

import { useResolver, useFocusError } from '_hooks/';

import { validationSchema } from '_modules/list/form';

export const DepartmentMarksContext = createContext();

const ListDetailPage = () => {
	const ref = useRef();
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);

	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	const [itemsMark, setItemsMark] = useState([]);

	const resolver = useResolver(validationSchema(data?.headers));

	const methods = useForm({ resolver });
	const {
		formState: { errors, isSubmitting },
		setFocus,
	} = methods;

	useFocusError(isSubmitting, errors, setFocus);

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

				if (!dayjs().isBetween(time_department.start, time_department.end, '[]')) {
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
		if (data?.status === 4) {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				department_mark_level: e.personal_mark_level,
				option_id: Number(e.options?.id) || null,
			}));

			dispatch(actions.renewMarks(payload));
		}
		if (data?.status < 4) {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				department_mark_level: e.class_mark_level,
				option_id: Number(e.options?.id) || null,
			}));

			dispatch(actions.renewMarks(payload));
		} else {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				department_mark_level: e.department_mark_level,
				option_id: Number(e.options?.id) || null,
			}));

			dispatch(actions.renewMarks(payload));
		}
	}, [data?.status, itemsMark]);

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return (
		<Box>
			<FormProvider {...methods}>
				{data && (
					<DepartmentMarksContext.Provider value={{ status: data?.status, itemsMark }}>
						{!available && (
							<CExpired
								roleName='khoa'
								start={data?.time_department?.start}
								end={data?.time_department?.end}
							/>
						)}

						<Box mb={1.5}>
							<Paper className='paper-wrapper'>
								<Stack direction='row' justifyContent='space-between'>
									<Typography fontSize={20} p={1.5} fontWeight={600}>
										{`${data?.user?.fullname} - ${data?.user?.std_code}`}
									</Typography>
									<Button
										startIcon={<Print />}
										sx={{ p: 1.5 }}
										onClick={handlePrint}
									>
										In phiếu
									</Button>
								</Stack>
							</Paper>
						</Box>

						<Paper className='paper-wrapper'>
							<Box p={1.5}>{data && <Form data={data} />}</Box>
						</Paper>

						<CPrintComponent data={data} marks={itemsMark} ref={ref} />
					</DepartmentMarksContext.Provider>
				)}
			</FormProvider>
		</Box>
	);
	//#endregion
};

export default ListDetailPage;
