import { useMemo } from 'react';

import { useDispatch } from 'react-redux';

import { Chip, TableCell, TableRow } from '@mui/material';

import { CLink } from '_controls/';

import { actions } from '_slices/currentInfo.slice';

export const MRow = ({ data, saveFilter }) => {
	//#region Data
	const dispatch = useDispatch();

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
	const onSetCurrent = () => {
		const info = {
			academic: data?.academic,
			semester: data?.semester,
		};

		dispatch(actions.setInfo(info));
		saveFilter();
	};
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>
				<CLink underline='hover' to={`${data?.id}`} onClick={onSetCurrent}>
					{data?.name + ' - ' + data?.code}
				</CLink>
			</TableCell>
			<TableCell align='center'>{data?.semester?.name}</TableCell>
			<TableCell align='center'>{data?.academic?.name}</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
};
