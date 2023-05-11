import { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';

import { ROLES } from '_constants/variables';

import { CViewIcon } from '_others/';

import dayjs from 'dayjs';

export const Row = ({ data, index, saveFilter }) => {
	//#region Data
	const navigate = useNavigate();

	const role = useMemo(() => {
		return ROLES.find((e) => e.id === data.role).name || '';
	}, [data.role]);
	//#endregion

	//#region Event
	const onClick = () => {
		saveFilter();

		navigate(`detail/${data.id}`);
	};
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>{data?.fullname}</TableCell>
			<TableCell align='center'>{role}</TableCell>
			<TableCell align='center'>
				{dayjs(data?.created_at).format('DD/MM/YYYY HH:mm:ss')}
			</TableCell>
			<TableCell align='center'>{data?.point}</TableCell>
			<TableCell align='center'>
				<Tooltip title='Xem'>
					<IconButton onClick={onClick}>
						<CViewIcon />
					</IconButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	);
	//#endregion
};
