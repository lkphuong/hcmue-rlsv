import { useMemo } from 'react';

import { Chip, TableCell, TableRow } from '@mui/material';

import { CLink } from '_controls/';

export const MRow = ({ data }) => {
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
				<CLink underline='hover' to={`/class/${data?.id}`}>
					{data?.code}
				</CLink>
			</TableCell>
			<TableCell align='center'>{data?.semester?.name}</TableCell>
			<TableCell align='center'>{data?.academic?.name}</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
};
