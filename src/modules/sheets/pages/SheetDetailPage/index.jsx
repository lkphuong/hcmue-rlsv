import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';

import { Form } from '_modules/sheets/components';

import { getItemsMarks, getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { actions } from '_slices/mark.slice';

import { CPrintComponent } from '_others/';

import { useResolver, useFocusError } from '_hooks/';

import { validationSchemaForm } from '_modules/sheets/form';

export const DepartmentMarksContext = createContext();

const SheetDetailPage = () => {
	const ref = useRef();

	//#region Data
	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	const [itemsMark, setItemsMark] = useState([]);

	const resolver = useResolver(validationSchemaForm(data?.headers));

	const methods = useForm({ resolver });
	const {
		formState: { errors, isSubmitting },
		setFocus,
	} = methods;

	useFocusError(isSubmitting, errors, setFocus);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const location = useLocation();
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		if (!sheet_id) return;

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
	}, [sheet_id]);

	const getMarks = useCallback(async () => {
		if (!data?.id) return;

		const res = await getItemsMarks(data.id);

		if (isSuccess(res))
			setItemsMark(() => {
				return res.data.map((e) => ({ ...e, id: Number(e.id) }));
			});
	}, [data?.id]);

	const handlePrint = useReactToPrint({
		content: () => ref.current,
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
				adviser_mark_level: e.class_mark_level,
				option_id: Number(e.options?.id) || null,
			}));

			dispatch(actions.renewMarks(payload));
		} else {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				adviser_mark_level: e.adviser_mark_level,
				option_id: Number(e.options?.id) || null,
			}));

			dispatch(actions.renewMarks(payload));
		}
	}, [data?.status, itemsMark]);

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return data ? (
		<Box>
			<FormProvider {...methods}>
				<DepartmentMarksContext.Provider value={{ itemsMark, status: data?.status }}>
					<Box mb={1.5}>
						<Paper className='paper-wrapper'>
							<Stack direction='row' justifyContent='space-between'>
								<Typography fontSize={20} p={1.5} fontWeight={600}>
									{`${data?.user?.fullname} - ${data?.user?.std_code}`}
								</Typography>
								<Button
									disabled={data?.status !== 4}
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
			</FormProvider>
		</Box>
	) : (
		<></>
	);

	//#endregion
};

export default SheetDetailPage;
