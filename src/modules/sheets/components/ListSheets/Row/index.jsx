import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow } from '@mui/material';

import { ROUTES } from '_constants/routes';

import { CEditIcon } from '_others/';

export const Row = ({ data, index }) => {
	const navigate = useNavigate();

	const onClick = () => navigate(`${ROUTES.ADMIN.SHEETS}/detail/${data.id}`);

	return (
		<TableRow>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='left'>{data?.user?.fullname}</TableCell>
			<TableCell align='center'>{data?.user?.std_code}</TableCell>
			<TableCell align='center'>
				{data?.sum_of_personal_marks === null ? 'Chưa chấm' : data.sum_of_personal_marks}
			</TableCell>
			<TableCell align='center'>
				{data?.sum_of_class_marks === null ? 'Chưa chấm' : data.sum_of_class_marks}
			</TableCell>
			<TableCell align='center'>
				{data?.sum_of_adviser_marks === null ? 'Chưa chấm' : data.sum_of_adviser_marks}
			</TableCell>
			<TableCell align='center'>
				{data?.sum_of_department_marks === null
					? 'Chưa chấm'
					: data.sum_of_department_marks}
			</TableCell>
			<TableCell align='center'>{data?.level}</TableCell>
			<TableCell align='center'>{data?.status}</TableCell>
			<TableCell align='center'>
				<IconButton onClick={onClick}>
					<CEditIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};
