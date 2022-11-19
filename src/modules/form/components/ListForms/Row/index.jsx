import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import { TableCell, TableRow } from '@mui/material';

import { FORM_STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';

const Row = memo(({ data, index }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => FORM_STATUS.find((e) => e.value === data?.status)?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = () => navigate(`${ROUTES.FORM}/update/${data.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover onClick={onEdit} sx={{ cursor: 'pointer' }}>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.semester.name}</TableCell>
			<TableCell align='center'>{data.acedemic.name}</TableCell>
			<TableCell align='center'>{dayjs(data.created_date).format('DD/MM/YYYY')}</TableCell>
			<TableCell align='center'>{data.created_by}</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
