import { useRef } from 'react';

import { IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';

import { CAddIcon, CDeleteIcon, CEditIcon } from '_others/';

import { deleteDepartmentAccount } from '_api/others.api';

import { ERRORS } from '_constants/messages';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

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
			</TableRow>

			<MModal ref={modalRef} refetch={refetch} editData={data} />
		</>
	);
	//#endregion
};
