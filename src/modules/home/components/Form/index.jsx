import React, { useCallback, useEffect, useState, createContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { alert } from '_func/alert';

import { isSuccess } from '_func/';

import { ROUTES } from '_constants/routes';

import { updateStudentSheets, getItemsMarks } from '_api/sheets.api';

import { actions } from '_slices/mark.slice';

import Header from './Header';

import './index.scss';

export const StudentMarksContext = createContext();

const Form = ({ data }) => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const [itemsMark, setItemsMark] = useState([]);

	const navigate = useNavigate();

	const dispatch = useDispatch();
	// //#endregion

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

			const res = await updateStudentSheets(data.id, body);

			if (isSuccess(res)) {
				const { data } = res;

				alert.confirmMark({
					onConfirm: () => {
						dispatch(actions.clearMarks());

						navigate(ROUTES.MY_SCORE, { replace: true });
					},
					fullname: data?.user?.fullname,
					mark: data?.sum_of_personal_marks,
					level: data?.level?.name,
				});
			} else {
				alert.fail({ text: res?.message || 'Cập nhật điểm không thành công!' });
			}
		} catch (error) {
			throw error;
		}
	};
	//#endregion

	useEffect(() => {
		getMarks();
	}, [getMarks]);

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
			<TableContainer>
				<Table
					stickyHeader
					sx={{ '& .MuiTableCell-root': { border: '1px solid rgba(224, 224, 224, 1)' } }}
				>
					<TableHead>
						<TableRow>
							<TableCell
								align='center'
								rowSpan={2}
								width={80}
								sx={{ minWidth: '80px' }}
							>
								Mục
							</TableCell>
							<TableCell rowSpan={2} sx={{ minWidth: '650px' }}>
								Nội dung đánh giá
							</TableCell>
							<TableCell
								align='center'
								rowSpan={2}
								width={150}
								sx={{ minWidth: '150px', maxWidth: '200px' }}
							>
								Khung điểm
							</TableCell>
							<TableCell align='center' colSpan={3} sx={{ minWidth: '390px' }}>
								Điểm đánh giá
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='center' width={130}>
								Sinh viên
							</TableCell>
							<TableCell align='center' width={130}>
								Lớp
							</TableCell>
							<TableCell align='center' width={130}>
								Khoa
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<StudentMarksContext.Provider value={{ itemsMark }}>
							{data?.headers?.length > 0 &&
								data.headers.map((e, i) => (
									<Header key={i} data={e} sheetId={data?.id} index={i + 1} />
								))}
						</StudentMarksContext.Provider>
					</TableBody>
				</Table>
			</TableContainer>

			<Box textAlign='center' mt={3}>
				<Button variant='contained' onClick={handleUpdate} disabled={!available}>
					Cập nhật
				</Button>
			</Box>
		</Paper>
	);
	//#endregion
};
export default Form;
