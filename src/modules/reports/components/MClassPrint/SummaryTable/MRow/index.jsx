import { TableCell, TableRow } from '@mui/material';

export const MRow = ({ data, total }) => {
	return (
		<TableRow>
			<TableCell align='left'>{data?.name}</TableCell>
			<TableCell align='center'>{data?.count}</TableCell>
			<TableCell align='center'>{((data?.count / total) * 100)?.toFixed(2) + '%'}</TableCell>
		</TableRow>
	);
};
