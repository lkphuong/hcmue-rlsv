import { useRef } from 'react';

import { IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';

import { CAddIcon, CDeleteIcon, CEditIcon, CResetIcon } from '_others/';

import { deleteDepartmentAccount } from '_api/others.api';

import { ERRORS } from '_constants/messages';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { restorePassword } from '_api/auth.api';

import { MModal } from '../..';

export const Row = ({ data, index, refetch, onAdd }) => {
	//#region Data
	const modalRef = useRef();
	//#endregion

	//#region Event
	const onEdit = () => modalRef.current.open();

	const onDelete = () => {
		alert.warningDelete({
			onConfirm: async () => {
				const res = await deleteDepartmentAccount(data.id);

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Xóa tài khoản thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};

	const onReset = () =>
		alert.question({
			onConfirm: async () => {
				alert.loading();

				const res = await restorePassword(data?.id, 3);

				if (isSuccess(res)) alert.success({ text: 'Reset mật khẩu cho khoa thành công.' });
				else alert.fail({ text: res?.message || ERRORS.FAIL });
			},
			title: 'Reset mật khẩu',
			text: 'Bạn có chắc muốn đặt lại mật khẩu mặc định cho tài khoản này không?',
		});
	//#endregion

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell align='center'>{index + 1}</TableCell>
				<TableCell align='left'>{data?.department?.name}</TableCell>
				<TableCell align='center'>
					{data?.username ? data.username : 'Chưa có tài khoản, hãy thêm mới'}
				</TableCell>
				<TableCell align='center' width={100}>
					{data?.id ? (
						<Stack direction='row' alignItems='center' justifyContent='space-between'>
							<Tooltip title='Sửa'>
								<IconButton onClick={onEdit} sx={{ color: 'white!important' }}>
									<CEditIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title='Xóa'>
								<IconButton onClick={onDelete}>
									<CDeleteIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					) : (
						<Tooltip title='Thêm mới'>
							<IconButton onClick={() => onAdd(data?.department?.id)}>
								<CAddIcon />
							</IconButton>
						</Tooltip>
					)}
				</TableCell>
				<TableCell align='center'>
					<Tooltip title='Reset mật khẩu'>
						<IconButton onClick={onReset}>
							<CResetIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>

			<MModal ref={modalRef} refetch={refetch} editData={data} />
		</>
	);
	//#endregion
};
