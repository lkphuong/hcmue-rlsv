import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { TableCell, TableRow } from '@mui/material';

import { STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';

const Row = memo(({ data, index }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => STATUS.find((e) => e.value.toString() === data?.status)?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = () => navigate(`${ROUTES.MY_SCORE}/${data?.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover onClick={onEdit} sx={{ cursor: 'pointer' }}>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.semester.name}</TableCell>
			<TableCell align='center'>{data.academic.name}</TableCell>
			<TableCell align='center'>{data.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data.level.name}</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
