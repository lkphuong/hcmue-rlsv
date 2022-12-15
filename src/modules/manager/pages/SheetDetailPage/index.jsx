import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { Form } from '_modules/manager/components';

import { getItemsMarks, getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';
import { actions } from '_slices/mark.slice';

export const DepartmentMarksContext = createContext();

const SheetDetailPage = () => {
	//#region Data
	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	const [itemsMark, setItemsMark] = useState([]);

	const dispatch = useDispatch();

	const location = useLocation();
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

	const getMarks = useCallback(async () => {
		try {
			const res = await getItemsMarks(data.id);

			if (isSuccess(res)) setItemsMark(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id]);
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
			}));

			dispatch(actions.renewMarks(payload));
		}
		if (data?.status < 4) {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				department_mark_level: e.class_mark_level,
			}));

			dispatch(actions.renewMarks(payload));
		} else {
			const payload = itemsMark.map((e) => ({
				item_id: Number(e.item.id),
				department_mark_level: e.department_mark_level,
			}));

			dispatch(actions.renewMarks(payload));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.status, itemsMark]);

	useEffect(() => {
		dispatch(actions.clearMarks());
	}, [location]);

	//#region Render
	return (
		<Box>
			<DepartmentMarksContext.Provider value={{ status: data?.status, itemsMark }}>
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
					<Box p={1.5}>{data && <Form data={data} />}</Box>
				</Paper>
			</DepartmentMarksContext.Provider>
		</Box>
	);
	//#endregion
};

export default SheetDetailPage;
