import { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import { Chip, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';

import { FORM_STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';
import { ERRORS } from '_constants/messages';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { cloneForm, deleteForm } from '_api/form.api';

import { CDeleteIcon, CDuplicateIcon, CEditIcon, CTickIcon } from '_others/';

//#region Array Status Chip
const generalStyle = {
	borderRadius: '10px',
	fontWeight: 500,
};

const STATUS = {
	0: (
		<Chip
			sx={{
				...generalStyle,
				color: 'rgb(255, 25, 67)',
				backgroundColor: 'rgba(255, 25, 67, 0.1)',
			}}
			label='Nháp'
		/>
	),
	1: (
		<Chip
			sx={{
				...generalStyle,
				color: 'rgb(18 196 5)',
				backgroundColor: 'rgb(3 186 28 / 10%)',
			}}
			label='Chờ phát hành'
		/>
	),
	2: (
		<Chip
			sx={{
				...generalStyle,
				color: 'rgb(255, 163, 25)',
				backgroundColor: 'rgba(255, 163, 25, 0.1)',
			}}
			label='Đang phát hành'
		/>
	),
	3: (
		<Chip
			sx={{
				...generalStyle,
				color: 'rgb(51, 194, 255)',
				backgroundColor: 'rgba(51, 194, 255, 0.1)',
			}}
			label='Đã phát hành'
		/>
	),
};
//#endregion

const Row = memo(({ data, index, refetch, saveFilter }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(() => {
		const item = FORM_STATUS.find((e) => e.value === data?.status);

		if (!item) return null;

		return STATUS[item.value];
	}, [data?.status]);
	//#endregion

	//#region Event
	const onEdit = () => {
		saveFilter();
		navigate(`${ROUTES.ADMIN.FORMS}/${data.id}`);
	};

	const onDelete = (e) => {
		e.stopPropagation();

		alert.warningDelete({
			onConfirm: async () => {
				const res = await deleteForm(data.id);

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Xóa biểu mẫu thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};

	const onClone = (e) => {
		e.stopPropagation();

		alert.question({
			onConfirm: async () => {
				const res = await cloneForm(data.id);

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Copy biểu mẫu thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};

	const onDone = (e) => {
		e.stopPropagation();

		alert.question({
			text: 'Kết thúc phát hành cho biểu mẫu này?',
			onConfirm: async () => {
				const res = { data };
				// const res = await cloneForm(data.id);

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Đóng biểu mẫu thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};
	//#endregion

	//#region Render
	return (
		<TableRow hover sx={{ '&:hover': { cursor: 'pointer' } }} onClick={onEdit}>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.semester.name}</TableCell>
			<TableCell align='center'>{data.academic.name}</TableCell>
			<TableCell align='center'>{dayjs(data.created_at).format('DD/MM/YYYY')}</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell align='center' width={120}>
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Tooltip title='Kết thúc phát hành phiếu'>
						<IconButton onClick={onDone} disabled={data.status === 0}>
							<CTickIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title='Tạo biểu mẫu mới dựa theo biểu mẫu này'>
						<IconButton onClick={onClone}>
							<CDuplicateIcon />
						</IconButton>
					</Tooltip>
					<IconButton onClick={onEdit} disabled={data.status === 2 || data.status === 3}>
						<CEditIcon />
					</IconButton>
					<Tooltip
						title={
							data.status !== 0 ? 'Chỉ có thể xóa biểu mẫu ở trạng thái nháp.' : ''
						}
					>
						<span>
							<IconButton onClick={onDelete} disabled={data.status !== 0}>
								<CDeleteIcon />
							</IconButton>
						</span>
					</Tooltip>
				</Stack>
			</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
