import React, { useCallback, useEffect, useState, createContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Button, Grid, Paper } from '@mui/material';

import { alert } from '_func/alert';

import { getHeadersByFormId } from '_api/form.api';

import { isSuccess } from '_func/';

import { ROUTES } from '_constants/routes';

import { updateStudentSheets, getItemsMarks } from '_api/sheets.api';

import { actions } from '_slices/mark.slice';

import Header from './Header';

import './index.scss';

export const StudentMarksContext = createContext();

const Form = ({ data }) => {
	//#region Data
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const [itemsMark, setItemsMark] = useState([]);

	const [headers, setHeaders] = useState([]);

	const navigate = useNavigate();

	const dispatch = useDispatch();
	// //#endregion

	//#region Event
	const getHeaders = useCallback(async () => {
		if (!data?.id) navigate(-1);

		try {
			const res = await getHeadersByFormId(data.id);

			if (isSuccess(res)) setHeaders(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id, navigate]);

	const getMarks = useCallback(async () => {
		try {
			const res = await getItemsMarks(data.id);

			if (isSuccess(res)) setItemsMark(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id]);

	const handleUpdate = async () => {
		try {
			if (!marks?.length) {
				alert.fail({ title: 'Bạn chưa cập nhật điểm!' });
				return;
			}

			const _data = marks.map((e) => ({ ...e, item_id: Number(e.item_id) }));

			const body = {
				role_id,
				data: _data,
			};

			const res = await updateStudentSheets(data.id, body);

			if (isSuccess(res)) {
				dispatch(actions.clearMarks());

				alert.success({ title: 'Cập nhật điểm thành công!' });

				navigate(ROUTES.MY_SCORE, { replace: true });
			} else {
				alert.fail({ text: res?.message || 'Cập nhật điểm không thành công!' });
			}
		} catch (error) {
			throw error;
		}
	};
	//#endregion

	useEffect(() => {
		getHeaders();
		getMarks();
	}, [getHeaders, getMarks]);

	useEffect(() => {
		const payload = itemsMark.map((e) => ({
			item_id: Number(e.item.id),
			personal_mark_level: e.personal_mark_level,
		}));

		dispatch(actions.renewMarks(payload));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemsMark]);

	//#region Render
	return (
		<Paper>
			<Grid
				container
				borderRadius={1}
				overflow='hidden'
				sx={{ boxShadow: '0px 2px 2px 1px rgb(0 0 0 / 20%)' }}
			>
				<Grid
					item
					xl={1}
					textAlign='center'
					sx={{ backgroundColor: '#b9bec0', fontWeight: 600, py: 1.3 }}
				>
					Mục
				</Grid>
				<Grid
					item
					xl={11}
					sx={{ backgroundColor: '#b9bec0', fontWeight: 600, py: 1.3, px: '10px' }}
				>
					<Grid container spacing={1}>
						<Grid item xs={6.4}>
							Nội dung đánh giá
						</Grid>
						<Grid item xs={2} textAlign='center'>
							Khung điểm
						</Grid>
						<Grid item xs={1.2} textAlign='center'>
							Sinh viên
						</Grid>
						<Grid item xs={1.2} textAlign='center'>
							Lớp
						</Grid>
						<Grid item xs={1.2} textAlign='center'>
							Khoa
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<StudentMarksContext.Provider value={{ itemsMark }}>
				<Grid container mt={1.5} alignItems='stretch' className='grid-fake-table'>
					{headers.length > 0 &&
						headers.map((e, i) => (
							<Header key={i} data={e} sheetId={data?.id} index={i + 1} />
						))}
				</Grid>
			</StudentMarksContext.Provider>

			<Button variant='contained' onClick={handleUpdate}>
				Cập nhật
			</Button>
		</Paper>
	);
	//#endregion
};
export default Form;
