import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { SheetChange } from '_modules/sheets/components';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { actions } from '_slices/mark.slice';

import { CLoadingSpinner } from '_others/';
import { getDetailChange, getMarksChange } from '_api/sheets.api';

export const NewContext = createContext();

const ChangeDetailPage = () => {
	//#region Data
	const { change_id } = useParams();

	const [loading, setLoading] = useState(false);

	const [data, setData] = useState(null);
	const [itemsMark, setItemsMark] = useState([]);

	const methods = useForm({ mode: 'all', shouldFocusError: true });

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const location = useLocation();
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		if (!change_id) return;

		setLoading(true);

		try {
			const res = await getDetailChange(change_id);

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
	}, [change_id]);

	const getMarks = useCallback(async () => {
		if (!data?.id) return;

		const res = await getMarksChange(data.id);

		if (isSuccess(res))
			setItemsMark(() => {
				return res.data.map((e) => ({ ...e, id: Number(e.id) }));
			});
		setLoading(false);
	}, [data?.id]);
	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

	useEffect(() => {
		getMarks();
	}, [getMarks]);

	useEffect(() => {
		let changes = [];
		if (data?.status < 3) {
			const payload = itemsMark.map((e) => {
				if (e?.flag) changes.push(Number(e.item.id));
				return {
					item_id: Number(e.item.id),
					adviser_mark_level: e.class_mark_level,
					option_id: Number(e.options?.id) || null,
					flag: e?.flag || false,
				};
			});
			dispatch(actions.setChanges(changes));
			dispatch(actions.renewMarks(payload));
		} else {
			const payload = itemsMark.map((e) => {
				if (e?.flag) changes.push(Number(e.item.id));
				return {
					item_id: Number(e.item.id),
					adviser_mark_level: e.adviser_mark_level,
					option_id: Number(e.options?.id) || null,
					flag: e?.flag || false,
				};
			});
			dispatch(actions.setChanges(changes));
			dispatch(actions.renewMarks(payload));
		}
	}, [data?.status, itemsMark]);

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return loading ? (
		<Box height='100%' display='flex' alignItems='center' justifyContent='center'>
			<CLoadingSpinner />
		</Box>
	) : data ? (
		<Box>
			<FormProvider {...methods}>
				<NewContext.Provider value={{ itemsMark, status: data?.status }}>
					<Box mb={1.5}>
						<Paper className='paper-wrapper'>
							<Stack direction='row' justifyContent='space-between'>
								<Typography fontSize={20} p={1.5} fontWeight={600}>
									{`${data?.user?.fullname} - ${data?.user?.std_code}`}
								</Typography>
							</Stack>
						</Paper>
					</Box>

					<Paper className='paper-wrapper'>
						<Box p={1.5}>{data && <SheetChange data={data} />}</Box>
					</Paper>
				</NewContext.Provider>
			</FormProvider>
		</Box>
	) : (
		<></>
	);

	//#endregion
};

export default ChangeDetailPage;
