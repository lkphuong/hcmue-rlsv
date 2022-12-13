import React, { useCallback, useEffect, useState, createContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Button, Grid, Paper } from '@mui/material';

import { alert } from '_func/alert';

import { isSuccess } from '_func/';

import { ROUTES } from '_constants/routes';

import { getItemsMarks, updateClassSheets } from '_api/sheets.api';

import { actions } from '_slices/mark.slice';

import Header from './Header';

import './index.scss';

export const ClassMarksContext = createContext();

const Form = ({ data, status }) => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const [itemsMark, setItemsMark] = useState([]);

	const navigate = useNavigate();

	const dispatch = useDispatch();
	//#endregion

	//#region Event
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

			const res = await updateClassSheets(data.id, body);

			if (isSuccess(res)) {
				const { data } = res;

				alert.confirmMark({
					onConfirm: () => {
						dispatch(actions.clearMarks());

						navigate(ROUTES.CLASS_SCORE, { replace: true });
					},
					fullname: data?.user?.fullname,
					mark: data?.sum_of_class_marks,
					level: data?.level?.name,
				});
			} else {
				alert.fail({ text: res?.message || 'Cập nhật điểm không thành công!' });
			}
		} catch (error) {
			throw error;
		}
	};

	const handleDeny = () => {
		alert.question({
			onConfirm: async () => {
				const res = await updateClassSheets(data.id, { role_id, graded: 0 });

				if (isSuccess(res)) {
					dispatch(actions.clearMarks());

					alert.success({ text: 'Cập nhật không xếp loại cho sinh viên thành công.' });

					navigate(ROUTES.CLASS_SCORE, { replace: true });
				}
			},
			text: 'Bạn chắc chắn điều chỉnh sinh viên này thành không xếp loại.',
		});
	};
	//#endregion

	useEffect(() => {
		getMarks();
	}, [getMarks]);

	useEffect(() => {
		if (status < 3) {
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
	}, [status, itemsMark]);

	//#region Render
	return (
		<Paper>
			<Grid
				container
				borderRadius={1}
				overflow='hidden'
				sx={{ boxShadow: '0px 2px 2px 1px rgb(0 0 0 / 20%)' }}
			>
				<Grid item xl={1} textAlign='center' className='grid-fake-header'>
					Mục
				</Grid>
				<Grid item xl={11} className='grid-fake-header' px='10px'>
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

			<ClassMarksContext.Provider value={{ itemsMark, status }}>
				<Grid container mt={1.5} alignItems='stretch' className='grid-fake-table'>
					{data?.headers?.length > 0 &&
						data.headers.map((e, i) => (
							<Header key={i} data={e} sheetId={data?.id} index={i + 1} />
						))}
				</Grid>
			</ClassMarksContext.Provider>

			<Box textAlign='center' mt={3}>
				<Button
					variant='contained'
					onClick={handleDeny}
					color='error'
					sx={{ mr: 1 }}
					disabled={!available}
				>
					Không xếp loại
				</Button>
				<Button variant='contained' onClick={handleUpdate} disabled={!available}>
					Cập nhật
				</Button>
			</Box>
		</Paper>
	);
	//#endregion
};
export default Form;
