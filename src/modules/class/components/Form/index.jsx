import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { Restore, Save } from '@mui/icons-material';

import LoadingButton from '@mui/lab/LoadingButton';

import { alert } from '_func/alert';

import { isSuccess, convertMarkValues } from '_func/';

import { ratingWeak, updateClassSheets } from '_api/sheets.api';

import { actions } from '_slices/mark.slice';

import { ERRORS } from '_constants/messages';

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
		const _data = convertMarkValues(values);

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

					navigate(-1, { replace: true });
				},
				fullname: data?.user?.fullname,
				mark: data?.sum_of_class_marks,
				level: data?.level?.name,
			});
		} else {
			alert.fail({ text: res?.message || 'Cập nhật điểm không thành công!' });
		}
	};

	const handleDeny = () => {
		alert.question({
			onConfirm: async () => {
				const res = await updateClassSheets(data.id, { role_id, graded: 0 });

				if (isSuccess(res)) {
					dispatch(actions.clearMarks());

					alert.success({ text: 'Cập nhật không xếp loại cho sinh viên thành công.' });

					navigate(-1, { replace: true });
				}
			},
			text: 'Bạn chắc chắn điều chỉnh sinh viên này thành không xếp loại.',
		});
	};

	const onUndo = () => dispatch(actions.setAvailable(true));

	const onRatingBad = () => {
		alert.question({
			onConfirm: async () => {
				try {
					await ratingWeak(data.id);

					dispatch(actions.clearMarks());

					alert.success({ text: 'Cập nhật đánh giá cho sinh viên thành công.' });

					navigate(-1, { replace: true });
				} catch (error) {
					alert.fail({ text: error?.message || ERRORS.FAIL });
				}
			},
			text: 'Bạn có chắc chắn muốn xếp loại sinh viên này là Kém.',
		});
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
							<TableCell rowSpan={2} sx={{ minWidth: '257px' }}>
								Nội dung đánh giá
							</TableCell>
							<TableCell
								align='center'
								rowSpan={2}
								width={140}
								sx={{ minWidth: '140px' }}
							>
								Khung điểm
							</TableCell>
							<TableCell align='center' colSpan={4} sx={{ minWidth: '390px' }}>
								Điểm đánh giá
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='center' width={85}>
								Sinh viên
							</TableCell>
							<TableCell align='center' width={85}>
								Lớp
							</TableCell>
							<TableCell align='center' width={85}>
								CVHT
							</TableCell>
							<TableCell align='center' width={85}>
								Khoa
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.headers?.length > 0 &&
							data.headers.map((e, i) => <Header key={i} data={e} index={i + 1} />)}
					</TableBody>
				</Table>
			</TableContainer>

			<Box textAlign='center' mt={3}>
				{!data?.is_return && (
					<Button
						variant='contained'
						disabled={isSubmitting || !available}
						sx={{ mr: 1, mb: 2 }}
						onClick={onRatingBad}
					>
						Rèn luyện kém
					</Button>
				)}
				{data?.is_return && !available ? (
					<Button
						variant='contained'
						onClick={onUndo}
						color='success'
						sx={{ mr: 1, mb: 2, color: 'white', backgroundColor: '#3EAE42' }}
						startIcon={<Restore />}
					>
						Hoàn tác
					</Button>
				) : (
					<Button
						variant='contained'
						onClick={handleDeny}
						color='error'
						sx={{ mr: 1, mb: 2 }}
						disabled={isSubmitting || !available}
					>
						Không xếp loại
					</Button>
				)}
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
