import { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import { TableCell, TableRow } from '@mui/material';

import { ROUTES } from '_constants/routes';

const Row = memo(({ data, index }) => {
	//#region Data
	const navigate = useNavigate();

	// const status = useMemo(
	// 	() => STATUS.find((e) => e.value.toString() === data?.status?.toString())?.name || null,
	// 	[data?.status]
	// );
	//#endregion

	//#region Event
	const onClick = () => navigate(`${ROUTES.STUDENT.SELF}/${data?.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover onClick={onClick} sx={{ cursor: 'pointer' }}>
			<TableCell align='center'>{index}</TableCell>
			<TableCell align='center'>{data.semester.display}</TableCell>
			<TableCell align='center'>{data.academic.name}</TableCell>
			<TableCell align='center'>{data.mark}</TableCell>
			<TableCell align='center'>{data?.level?.name || 'Kém'}</TableCell>
			<TableCell align='center'>{data?.status}</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
