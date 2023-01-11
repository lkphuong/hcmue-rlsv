import { useNavigate } from 'react-router-dom';

import { IconButton, TableCell, TableRow } from '@mui/material';
import { BorderColor } from '@mui/icons-material';
import { ROUTES } from '_constants/routes';

export const Row = ({ data, index }) => {
	const navigate = useNavigate();

	const onClick = () => navigate(`${ROUTES.ADMIN.SHEETS}/detail/${data.id}`);

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
				<IconButton onClick={onClick}>
					<BorderColor />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};
