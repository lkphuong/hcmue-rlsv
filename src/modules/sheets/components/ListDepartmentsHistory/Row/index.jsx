import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Chip, TableCell, TableRow, Link } from '@mui/material';
import { actions } from '_slices/currentInfo.slice';

export const Row = ({ data, index, academic, semester }) => {
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

	const onSetCurrent = () => {
		const info = {
			academic,
			semester,
			department: data,
		};

		dispatch(actions.setInfo(info));
	};

	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>
				<Link
					underline='hover'
					textTransform='uppercase'
					component={RouterLink}
					to={`${data?.id}`}
					onClick={onSetCurrent}
				>
					{data?.name}
				</Link>
			</TableCell>
			<TableCell align='center'>{semester?.name}</TableCell>
			<TableCell align='center'>{academic?.name}</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
};
