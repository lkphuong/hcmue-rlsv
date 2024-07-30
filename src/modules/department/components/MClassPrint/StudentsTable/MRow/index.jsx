import { TableCell, TableRow } from '@mui/material';

export const MRow = ({ data, index }) => {
	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='center'>{data?.user?.std_code}</TableCell>
			<TableCell align='center'>{data?.user?.fullname}</TableCell>
			<TableCell align='center'>{data?.user?.birthday}</TableCell>
			<TableCell align='center'>{data?.user?.class?.name}</TableCell>
			<TableCell align='center'>{data?.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_class_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_adviser_marks}</TableCell>
			<TableCell align='center'>{data?.sum_of_department_marks}</TableCell>
			<TableCell align='center'>
				{data?.status === 5 ? 'Không xếp loại' : data?.level?.name}
			</TableCell>
		</TableRow>
	);
};
