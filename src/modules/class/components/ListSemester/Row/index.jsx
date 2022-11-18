import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { TableCell, TableRow } from '@mui/material';

import { LEVEL, STATUS } from '_constants/variables';

const Row = memo(({ data, index }) => {
	//#region Data
	const navigate = useNavigate();

	const rating = useMemo(
		() => LEVEL.find((e) => e.value === data?.rating)?.name || null,
		[data?.rating]
	);

	const status = useMemo(
		() => STATUS.find((e) => e.value === data?.status)?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = () => navigate(`/${data?.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover onClick={onEdit} sx={{ cursor: 'pointer' }}>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.fullname}</TableCell>
			<TableCell align='center'>{data.code}</TableCell>
			<TableCell align='center'>{data.total}</TableCell>
			<TableCell align='center'>{rating}</TableCell>
			<TableCell align='center'>{status}</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
