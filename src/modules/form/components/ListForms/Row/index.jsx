import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import { Chip, IconButton, Stack, TableCell, TableRow, Tooltip, Zoom } from '@mui/material';
import { DeleteForever, Edit, FileCopy } from '@mui/icons-material';

import { FORM_STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';
import { ERRORS } from '_constants/messages';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import { cloneForm, deleteForm } from '_api/form.api';

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
			label='Đã phát hành'
		/>
	),
	2: (
		<Chip
			sx={{
				...generalStyle,
				color: 'rgb(255, 163, 25)',
				backgroundColor: 'rgba(255, 163, 25, 0.1)',
			}}
			label='Đang xử lý'
		/>
	),
	3: (
		<Chip
			sx={{
				...generalStyle,
				color: 'rgb(51, 194, 255)',
				backgroundColor: 'rgba(51, 194, 255, 0.1)',
			}}
			label='Hoàn thành'
		/>
	),
};
//#endregion

const Row = memo(({ data, index, refetch }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(() => {
		const item = FORM_STATUS.find((e) => e.value === data?.status);

		if (!item) return null;

		return STATUS[item.value];
	}, [data?.status]);
	//#endregion

	//#region Event
	const onEdit = () => navigate(`${ROUTES.FORM}/update/${data.id}`);

	const onDelete = () => {
		if (data.status !== 0) {
			alert.fail({
				title: 'Không được phép!',
				text: 'Chỉ có thể xóa biểu mẫu ở trạng thái nháp.',
			});
		} else {
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
		}
	};

	const onClone = () => {
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
	//#endregion

	//#region Render
	return (
		<TableRow hover>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.semester.name}</TableCell>
			<TableCell align='center'>{data.academic.name}</TableCell>
			<TableCell align='center'>{dayjs(data.created_date).format('DD/MM/YYYY')}</TableCell>
			<TableCell align='center'>{data.created_by}</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell align='center' width={120}>
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Tooltip
						TransitionComponent={Zoom}
						arrow
						title='Tạo biểu mẫu mới dựa theo biểu mẫu này'
						disableInteractive
					>
						<IconButton onClick={onClone}>
							<FileCopy />
						</IconButton>
					</Tooltip>
					<IconButton onClick={onEdit}>
						<Edit />
					</IconButton>
					<IconButton onClick={onDelete}>
						<DeleteForever />
					</IconButton>
				</Stack>
			</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
