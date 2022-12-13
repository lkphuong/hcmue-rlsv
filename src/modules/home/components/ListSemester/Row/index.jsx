import React, { memo, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { TableCell, TableRow, IconButton, Tooltip } from '@mui/material';
import { HistoryEdu } from '@mui/icons-material';

import { STATUS } from '_constants/variables';
import { ROUTES } from '_constants/routes';

const Row = memo(({ data, index }) => {
	//#region Data
	const navigate = useNavigate();

	const status = useMemo(
		() => STATUS.find((e) => e.value.toString() === data?.status?.toString())?.name || null,
		[data?.status]
	);
	//#endregion

	//#region Event
	const onEdit = () => navigate(`${ROUTES.MY_SCORE}/${data?.id}`);
	//#endregion

	//#region Render
	return (
		<TableRow hover>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center'>{data.semester.name}</TableCell>
			<TableCell align='center'>{data.academic.name}</TableCell>
			<TableCell align='center'>{data.sum_of_personal_marks}</TableCell>
			<TableCell align='center'>{data?.level?.name || 'Kém'}</TableCell>
			<TableCell align='center'>{status}</TableCell>
			<TableCell>
				<Tooltip title='Chấm điểm'>
					<IconButton onClick={onEdit}>
						<HistoryEdu />
					</IconButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	);
	//#endregion
});

Row.displayName = Row;

export default Row;
