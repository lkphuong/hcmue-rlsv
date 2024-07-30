import { useMemo } from 'react';

import { Chip, TableCell, TableRow } from '@mui/material';

import { CLink } from '_controls/';

export const MRow = ({ data, onSetCurrent }) => {
	//#region Data
	const status = useMemo(
		() =>
			data?.status?.toString() === 'true' ? (
				<Chip label='Hoàn thành' color='primary' />
			) : (
				<Chip label='Chưa hoàn thành' color='error' />
			),
		[data?.status]
	);
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>
				<CLink underline='hover' to={`${data?.id}`} onClick={onSetCurrent}>
					{data?.name + ' - ' + data?.code}
				</CLink>
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
};
