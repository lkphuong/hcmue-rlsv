import { useMemo } from 'react';

import { Chip, TableCell, TableRow, Link } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import { ROUTES } from '_constants/routes';

export const Row = ({ data, index, onSetCurrent }) => {
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
	const onClick = () => onSetCurrent({ classData: data });
	//#endregion

	//#region Render
	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>
				<Link
					underline='hover'
					textTransform='uppercase'
					component={RouterLink}
					to={`${ROUTES.DEPARTMENT.SHEETS}/${data?.id}`}
					onClick={onClick}
				>
					{(data?.name ?? '') + ' - ' + data?.code}
				</Link>
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
};
