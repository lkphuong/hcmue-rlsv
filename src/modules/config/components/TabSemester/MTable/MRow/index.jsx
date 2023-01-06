import React from 'react';

import { Button, TableCell, TableRow } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

import { removeSemester } from '_api/options.api';

import { isSuccess } from '_func/';

import { alert } from '_func/alert';

import { ERRORS } from '_constants/messages';
import dayjs from 'dayjs';

export const MRow = ({ data, index, refetch }) => {
	//#region Data
	//#endregion

	//#region Event
	const onDelete = () => {
		alert.warningDelete({
			onConfirm: async () => {
				const res = await removeSemester(data.id);

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Xóa học kỳ thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
		});
	};
	//#endregion

	//#region Render

	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='center'>{data.name}</TableCell>
			<TableCell align='center'>
				{data?.start ? dayjs(data.start).format('MM/YYYY') : null}
			</TableCell>
			<TableCell align='center'>
				{data?.end ? dayjs(data.end).format('MM/YYYY') : null}
			</TableCell>
			<TableCell align='center'>{data?.academic?.name}</TableCell>
			<TableCell align='center'>
				<Button color='error' endIcon={<DeleteForever />} onClick={onDelete}>
					Xóa
				</Button>
			</TableCell>
		</TableRow>
	);
	//#endregion
};
