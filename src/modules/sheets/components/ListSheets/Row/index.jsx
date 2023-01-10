import { BorderColor } from '@mui/icons-material';
import { IconButton, TableCell, TableRow } from '@mui/material';

export const Row = ({ data, index }) => {
	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>{data?.name}</TableCell>
			<TableCell align='center'>{data?.std_code}</TableCell>
			<TableCell align='center'>{data?.student_mark}</TableCell>
			<TableCell align='center'>{data?.class_mark}</TableCell>
			<TableCell align='center'>{data?.adviser_mark}</TableCell>
			<TableCell align='center'>{data?.department_mark}</TableCell>
			<TableCell align='center'>{data?.level}</TableCell>
			<TableCell align='center'>{data?.status}</TableCell>
			<TableCell align='center'>
				<IconButton>
					<BorderColor />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};
