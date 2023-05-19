import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Chip, TableCell, TableRow, Link } from '@mui/material';

import { actions as filterActions } from '_slices/filter.slice';

export const Row = ({ data, index, onSetCurrent }) => {
	const dispatch = useDispatch();

	const onClick = () => {
		onSetCurrent({ department: data });
		dispatch(filterActions.setFilter(null));
	};

	const status = useMemo(
		() =>
			data?.status?.toString() === 'true' ? (
				<Chip label='Hoàn thành' color='primary' />
			) : (
				<Chip label='Chưa hoàn thành' color='error' />
			),
		[data?.status]
	);

	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>
				<Link
					underline='hover'
					textTransform='uppercase'
					component={RouterLink}
					to={`${data?.id}`}
					onClick={onClick}
				>
					{data?.name}
				</Link>
			</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
};
