import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { Save } from '@mui/icons-material';

import LoadingButton from '@mui/lab/LoadingButton';

import { alert } from '_func/alert';

import { isSuccess } from '_func/';

import { updateStudentSheets } from '_api/sheets.api';

import { actions } from '_slices/mark.slice';

import Header from './Header';

import './index.scss';

export const Form = ({ data }) => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useFormContext();

	const navigate = useNavigate();

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const onSubmit = async (values) => {
		const marks = Object.values(values).flat();

		const _data = marks.map((e) => {
			const obj = { ...e, item_id: Number(e.item_id) };

			if (obj?.files) {
				const files = obj.files.map((el) => ({ ...el, id: el.file_id }));

				return { ...obj, files };
			} else return obj;
		});

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

					navigate(-1, { replace: true });
				},
				fullname: data?.user?.fullname,
				mark: data?.sum_of_personal_marks,
				level: data?.level?.name,
			});
		} else {
			alert.fail({ text: res?.message || 'Cập nhật điểm không thành công!' });
		}
	};
	//#endregion

	//#region Render
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TableContainer>
				<Table
					stickyHeader
					sx={{
						'& .MuiTableCell-root': { border: '1px solid rgba(224, 224, 224, 1)' },
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell
								align='center'
								rowSpan={2}
								width={60}
								sx={{ minWidth: '60px' }}
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
							<TableCell align='center' colSpan={4} sx={{ minWidth: '390px' }}>
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
								CVHT
							</TableCell>
							<TableCell align='center' width={130}>
								Khoa
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.headers?.length > 0 &&
							data.headers.map((e, i) => (
								<Header key={i} data={e} sheetId={Number(data?.id)} index={i + 1} />
							))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box textAlign='center' mt={3}>
				<LoadingButton
					sx={{ mb: 2 }}
					variant='contained'
					type='submit'
					disabled={!available}
					loading={isSubmitting}
					loadingPosition='start'
					startIcon={<Save />}
				>
					Cập nhật
				</LoadingButton>
			</Box>
		</form>
	);
	//#endregion
};
