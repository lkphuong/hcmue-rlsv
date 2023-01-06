import { useRef } from 'react';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

import { ERRORS } from '_constants/messages';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { MModal } from '../..';

export const Row = ({ data, index, refetch }) => {
	//#region Data
	const modalRef = useRef();
	//#endregion

	//#region Event
	// const onEdit = () => modalRef.current.open();

	const onDelete = () => {
		alert.warningDelete({
			onConfirm: async () => {
				// const res = await deleteForm(data.id);
				const res = { status: 200 };

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
				<TableCell align='center'>{data.username}</TableCell>
				<TableCell align='center'>{data?.password}</TableCell>
				<TableCell align='center' width={100}>
					{/* <Stack direction='row' alignItems='center' justifyContent='space-between'> */}
					{/* <Tooltip title='Sửa'>
							<IconButton onClick={onEdit}>
								<BorderColor />
							</IconButton>
						</Tooltip> */}
					<Tooltip title='Xóa'>
						<IconButton onClick={onDelete}>
							<DeleteForever />
						</IconButton>
					</Tooltip>
					{/* </Stack> */}
				</TableCell>
			</TableRow>

			<MModal ref={modalRef} refetch={refetch} editData={data} />
		</>
	);
	//#endregion
};
